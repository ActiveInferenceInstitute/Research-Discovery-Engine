import os
import re
import networkx as nx
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from itertools import combinations, product
import numpy as np
import plotly.express as px
from adjustText import adjust_text
import community as community_louvain
from scipy.stats import entropy
from tqdm import tqdm

# --- Configuration ---
MARKDOWN_FILES = [f for f in os.listdir('.') if f.endswith('.md')]
OUTPUT_DIR = "knowledge_graph_final_definitive"
NODE_CATEGORIES = {
    'applications.md': ('Application', '#e41a1c'), 'materials.md':    ('Material',    '#377eb8'),
    'mechanisms.md':   ('Mechanism',   '#4daf4a'), 'methods.md':      ('Method',      '#984ea3'),
    'phenomena.md':    ('Phenomenon',  '#ff7f00'), 'theoretical.md':  ('Theory',      '#a65628'),
}
CATEGORY_ORDER = ['Theory', 'Mechanism', 'Phenomenon', 'Method', 'Material', 'Application']

#===========================================================================
# UTILITY AND SETUP FUNCTIONS
#===========================================================================
def get_node_metadata(files):
    node_info = {}
    for md_file in files:
        if md_file in NODE_CATEGORIES:
            category, color = NODE_CATEGORIES[md_file]
            with open(md_file, 'r', encoding='utf-8') as f:
                headers = re.findall(r"###\s+([a-zA-Z0-9\-\_]+)", f.read())
                for header in headers:
                    if header not in node_info: node_info[header] = {'category': category, 'color': color}
    return node_info

def build_explicit_link_graph(files, node_info):
    G = nx.DiGraph()
    link_regex = re.compile(r"\[\[\./([a-z\-\_]+\.md)#([a-zA-Z0-9\-\_]+)\]\]")
    for node, data in node_info.items(): G.add_node(node, **data)
    for md_file in files:
        if md_file in NODE_CATEGORIES:
            with open(md_file, 'r', encoding='utf-8') as f:
                content = f.read(); sections = re.split(r"###\s+", content); headers = [""] + re.findall(r"###\s+([a-zA-Z0-9\-\_]+)", content)
                for i, section in enumerate(sections[1:], 1):
                    if i < len(headers):
                        source_node, found_links = headers[i], link_regex.findall(section)
                        if source_node in G:
                            for _, target_node in found_links:
                                if target_node in G: G.add_edge(source_node, target_node)
    return G

def build_cooccurrence_data(files, node_info):
    print("--- Building Co-occurrence Data ---")
    link_regex = re.compile(r"\[\[\./([a-z\-\_]+\.md)#([a-zA-Z0-9\-\_]+)\]\]")
    doc_links = {mf: [link[1] for link in link_regex.findall(open(mf, 'r', encoding='utf-8').read())] for mf in files if mf in NODE_CATEGORIES}
    abundance_matrix = pd.DataFrame(0, index=sorted(node_info.keys()), columns=sorted(doc_links.keys()))
    for doc, links in doc_links.items():
        counts = pd.Series(links).value_counts()
        for concept, count in counts.items():
            if concept in abundance_matrix.index: abundance_matrix.loc[concept, doc] = count
    abundance_matrix = abundance_matrix.loc[(abundance_matrix.sum(axis=1) > 0)]
    cooccurrence_matrix = abundance_matrix.T.corr(method='spearman').fillna(0)
    print(f"    -> Built co-occurrence matrix for {len(cooccurrence_matrix)} concepts.\n")
    return cooccurrence_matrix

#===========================================================================
# ANALYSIS & VISUALIZATION FUNCTIONS
#===========================================================================
def create_and_save_node_list(G_directed, innovation_scores_df, output_dir):
    """
    Saves a master list of all nodes with their categories, PageRank,
    and innovation strategy scores to a CSV file.
    """
    print("--- Stage 1: Generating Master Node List with Metrics ---")

    if not G_directed:
        print("    -> Explicit link graph (G_directed) is empty. Cannot generate master node list.")
        return

    # Convert node data from the graph to a DataFrame
    node_data_list = []
    for node, data in G_directed.nodes(data=True):
        node_data_list.append({
            'node_id': node,
            'category': data.get('category', 'Unknown'),
            'color': data.get('color', 'grey'),
            'pagerank': data.get('pagerank', 0.0) # PageRank should have been added
        })

    df_nodes = pd.DataFrame(node_data_list)
    df_nodes.set_index('node_id', inplace=True)

    # Join with innovation scores if they exist and are not empty
    if innovation_scores_df is not None and not innovation_scores_df.empty:
        # Ensure the index names match for a clean join
        if innovation_scores_df.index.name != 'node_id':
             innovation_scores_df.index.name = 'node_id' # Or 'Concept' if that's its name

        # Select only the score columns to join, and rename if necessary
        # Assuming innovation_scores_df has 'Influence_PageRank' and 'Interdisciplinarity_Entropy'
        # and its index is the concept name (node_id)
        score_columns_to_join = ['Influence_PageRank', 'Interdisciplinarity_Entropy']

        # Check if columns exist before trying to join
        valid_score_columns = [col for col in score_columns_to_join if col in innovation_scores_df.columns]

        if valid_score_columns:
            df_nodes = df_nodes.join(innovation_scores_df[valid_score_columns], how='left')
        else:
            print("    -> Innovation score columns not found in innovation_scores_df. Proceeding without them.")
    else:
        print("    -> No innovation scores provided. Master list will not include them.")
        # Add empty columns if innovation_scores_df is None or empty, for consistency
        df_nodes['Influence_PageRank'] = np.nan
        df_nodes['Interdisciplinarity_Entropy'] = np.nan

    # Sort for better readability
    df_nodes.sort_values(by='pagerank', ascending=False, inplace=True)

    output_csv_path = os.path.join(output_dir, "node_master_list_with_metrics.csv")
    df_nodes.to_csv(output_csv_path)
    print(f"    -> Saved authoritative dictionary with metrics for {len(df_nodes)} concepts to '{output_csv_path}'.\n")

def analyze_innovation_strategies(G, cooccurrence_matrix, node_info, output_dir):
    print("--- Stage 3: Analyzing Innovation Strategies ---")
    if not G or cooccurrence_matrix.empty: return None
    pagerank_series = pd.Series(nx.get_node_attributes(G, 'pagerank'), name='Influence_PageRank')
    cooccurrence_nodes = set(cooccurrence_matrix.index); pagerank_nodes = set(pagerank_series.index)
    common_nodes = list(cooccurrence_nodes.intersection(pagerank_nodes))
    interdisciplinarity = {}
    for node in common_nodes:
        row = cooccurrence_matrix.loc[node]; valid_neighbors = row[row.abs() > 0.01].index
        neighbor_cats = [node_info.get(n, {}).get('category') for n in valid_neighbors if n in node_info]
        cat_counts = pd.Series(neighbor_cats).value_counts()
        if not cat_counts.empty: interdisciplinarity[node] = entropy(cat_counts, base=2)
        else: interdisciplinarity[node] = 0
    df = pd.DataFrame(pagerank_series).join(pd.Series(interdisciplinarity, name='Interdisciplinarity_Entropy'))
    df = df.loc[common_nodes]; df['Category'] = df.index.map({n: d.get('category') for n, d in node_info.items()}); df.dropna(inplace=True); df.index.name = 'Concept'; df.sort_values('Influence_PageRank', ascending=False, inplace=True)
    df.to_csv(os.path.join(output_dir, "innovation_strategies_scores.csv")); print(f"    -> Saved innovation scores for {len(df)} concepts.")
    plt.figure(figsize=(16, 12)); ax = plt.gca(); sns.scatterplot(data=df, x='Influence_PageRank', y='Interdisciplinarity_Entropy', hue='Category', s=150, edgecolor='black', alpha=0.8, palette={cat[0]: cat[1] for cat in NODE_CATEGORIES.values()}, ax=ax)
    ax.set_title("The Innovation Strategies of Concepts", fontsize=24); ax.set_xlabel("Influence (PageRank Centrality)", fontsize=14); ax.set_ylabel("Interdisciplinarity (Co-occurrence Entropy)", fontsize=14); ax.legend(bbox_to_anchor=(1.02, 1), loc='upper left')
    top_nodes = df.nlargest(5, 'Influence_PageRank').index.union(df.nlargest(5, 'Interdisciplinarity_Entropy').index)
    texts = [ax.text(df.loc[n, 'Influence_PageRank'], df.loc[n, 'Interdisciplinarity_Entropy'], n) for n in top_nodes if n in df.index]
    if texts: adjust_text(texts, ax=ax, arrowprops=dict(arrowstyle='->', color='black'))
    median_x, median_y = df['Influence_PageRank'].median(), df['Interdisciplinarity_Entropy'].median()
    ax.axvline(median_x, color='grey', linestyle='--'); ax.axhline(median_y, color='grey', linestyle='--');
    ax.text(0.95, 0.95, 'Boundary Spanners', transform=ax.transAxes, ha='right', va='top', fontsize=14, weight='bold'); ax.text(0.95, 0.05, 'Foundational Hubs', transform=ax.transAxes, ha='right', va='bottom', fontsize=14, weight='bold'); ax.text(0.05, 0.95, 'Niche Connectors', transform=ax.transAxes, ha='left', va='top', fontsize=14, weight='bold'); ax.text(0.05, 0.05, 'Underdeveloped Concepts', transform=ax.transAxes, ha='left', va='bottom', fontsize=14, weight='bold')
    plt.tight_layout(rect=[0,0,0.85,1]); plt.savefig(os.path.join(output_dir, "innovation_strategies.png")); plt.close()
    df_interactive = df.reset_index(); fig = px.scatter(df_interactive, x='Influence_PageRank', y='Interdisciplinarity_Entropy', color='Category', hover_name='Concept', color_discrete_map={cat[0]: cat[1] for cat in NODE_CATEGORIES.values()}, title='The Interactive Innovation Strategies of Concepts', labels={"Influence_PageRank": "Influence (Centrality)", "Interdisciplinarity_Entropy": "Interdisciplinarity (Entropy)"})
    fig.add_vline(x=median_x, line_dash="dash", line_color="grey"); fig.add_hline(y=median_y, line_dash="dash", line_color="grey")
    fig.write_html(os.path.join(output_dir, "interactive_innovation_strategies.html")); print(f"    -> Saved INTERACTIVE innovation strategies plot.\n"); return df

def analyze_knowledge_gaps(G, node_info, output_dir):
    print("--- Stage 4: The Atlas of Opportunity ---")
    if not G: return None
    potential_links = []; nodes_by_cat = {cat[0]: [n for n, d in node_info.items() if d['category'] == cat[0]] for cat in NODE_CATEGORIES.values()}
    for cat1, cat2 in product(CATEGORY_ORDER, repeat=2):
        if cat1 == cat2: continue
        for u in nodes_by_cat.get(cat1, []):
            for v in nodes_by_cat.get(cat2, []):
                if u in G and v in G and not G.has_edge(u, v):
                    successors_u = set(G.successors(u)); successors_v = set(G.successors(v))
                    score = len(successors_u.intersection(successors_v))
                    if score > 0: potential_links.append({'Source': u, 'Target': v, 'Score': score, 'Source_Category': cat1, 'Target_Category': cat2})
    if not potential_links: print("    -> No potential links found."); return None
    df_gaps = pd.DataFrame(potential_links).sort_values('Score', ascending=False)
    df_gaps.to_csv(os.path.join(output_dir, "universal_knowledge_gaps.csv"), index=False); print(f"    -> Scored {len(df_gaps)} potential links and saved to CSV.")
    n_rows, n_cols = len(CATEGORY_ORDER), len(CATEGORY_ORDER); fig, axes = plt.subplots(n_rows, n_cols, figsize=(40, 35), sharex='col'); fig.suptitle("The Atlas of Opportunity: Top Predicted Links Between Categories", fontsize=32)
    for i, source_cat in enumerate(CATEGORY_ORDER):
        for j, target_cat in enumerate(CATEGORY_ORDER):
            ax = axes[i, j]
            if i == j: ax.text(0.5, 0.5, source_cat, ha='center', va='center', fontsize=16, weight='bold', rotation=45, color='lightgrey'); ax.set_facecolor('whitesmoke'); ax.tick_params(left=False, labelleft=False, bottom=False, labelbottom=False)
            else:
                subset = df_gaps[(df_gaps['Source_Category'] == source_cat) & (df_gaps['Target_Category'] == target_cat)]
                if not subset.empty:
                    top_5 = subset.head(5).iloc[::-1]; top_5['label'] = top_5['Source'].str.slice(0, 20) + ' ->\n' + top_5['Target'].str.slice(0, 20)
                    sns.barplot(ax=ax, data=top_5, y='label', x='Score', palette='mako_r', orient='h')
            if i == 0: ax.set_title(target_cat, fontsize=14, weight='bold')
            ax.set_ylabel(''); ax.set_xlabel(''); ax.tick_params(axis='y', labelsize=8)
    plt.tight_layout(rect=[0, 0, 1, 0.96]); plt.savefig(os.path.join(output_dir, "knowledge_gap_atlas_matrix.png")); plt.close()
    print("    -> Saved Knowledge Gap Atlas plot matrix.\n"); return df_gaps


def analyze_communities(G_directed, node_info, output_dir): # Modified to accept node_info for G attributes
    print("--- Stage 2b: Mapping the Conceptual Landscape (Silo View) ---")
    if not G_directed: return G_directed # Return original G if no nodes

    # Ensure all nodes in G_directed have metadata from node_info
    for node, data in node_info.items():
        if node in G_directed:
            G_directed.nodes[node].update(data)

    G_undirected = G_directed.to_undirected()
    if G_undirected.number_of_nodes() == 0:
        print("    -> Graph is empty after converting to undirected. Skipping community detection.")
        return G_directed

    partition = community_louvain.best_partition(G_undirected, random_state=42)
    nx.set_node_attributes(G_directed, partition, 'community')

    pagerank = nx.get_node_attributes(G_directed, 'pagerank') # Assumes PageRank is pre-calculated

    plt.figure(figsize=(28, 28)) # Increased size
    ax = plt.gca()

    # Use a subset of nodes for layout if graph is too dense, e.g., top by PageRank
    # For this final version, let's try to plot all nodes in communities
    nodes_in_communities = [n for n in G_undirected.nodes() if n in partition]
    if not nodes_in_communities:
        print("    -> No nodes found in communities. Skipping landscape plot.")
        return G_directed

    subgraph_for_layout = G_undirected.subgraph(nodes_in_communities)
    if subgraph_for_layout.number_of_nodes() == 0:
        print("    -> Subgraph for layout is empty. Skipping landscape plot.")
        return G_directed

    pos = nx.spring_layout(subgraph_for_layout, k=0.5, iterations=70, seed=42, weight=None)

    node_colors_for_plot = [partition.get(node, -1) for node in subgraph_for_layout.nodes()]
    node_sizes_for_plot = [pagerank.get(node, 0.0001) * 100000 + 100 for node in subgraph_for_layout.nodes()]

    nx.draw(subgraph_for_layout, pos, ax=ax, with_labels=False,
            node_color=node_colors_for_plot, cmap=plt.get_cmap('tab20'),
            node_size=node_sizes_for_plot, width=0.3, alpha=0.7, edge_color='silver')

    # Label only a few top nodes per community for clarity
    labels_to_draw = {}
    community_leaders = {}
    for node, comm_id in partition.items():
        if node in subgraph_for_layout:
            if comm_id not in community_leaders or pagerank.get(node,0) > pagerank.get(community_leaders[comm_id],0):
                community_leaders[comm_id] = node
    for comm_id, leader_node in community_leaders.items():
         labels_to_draw[leader_node] = leader_node.replace('-', ' ').title()

    texts = [ax.text(pos[node][0], pos[node][1], label_text, ha='center', va='center', fontsize=10, weight='bold',
                     bbox=dict(boxstyle="round,pad=0.3", fc=NODE_CATEGORIES.get(G_directed.nodes[node].get('file'), ('', 'lightgrey'))[1], alpha=0.7) if node in pos else "")
             for node, label_text in labels_to_draw.items() if node in pos]
    if texts:
        adjust_text(texts, arrowprops=dict(arrowstyle="-", color='black', lw=0.5))

    ax.set_title("The Conceptual Landscape: A Map of Research Silos", fontsize=32)
    ax.axis('off')
    plt.savefig(os.path.join(output_dir, "conceptual_landscape_map_silos.png"))
    plt.close()
    print("    -> Saved conceptual landscape map (silo view).\n")
    return G_directed


def synthesize_and_plot_trajectory(G_directed, cooccurrence_matrix, df_gaps, node_info, output_dir,
                                   start_node_id,
                                   end_node_id,
                                   max_path_len_for_search=4,
                                   min_cooc_for_edge_in_path=0.3,
                                   top_n_paths_to_save=20):
    """
    DEFINITIVE PATH SYNTHESIS 9.0: "The Innovation Roadmap (Spring Layout)".
    Finds and scores multiple plausible paths. Visualizes the top-scoring path
    as a clear network trajectory using spring_layout, with relevant supporting context.
    """
    print(f"--- Stage 5: Synthesizing Research Trajectories from '{start_node_id}' to '{end_node_id}' ---")

    # ... (Pathfinding and CSV saving logic remains exactly the same as the previous correct version) ...
    # ... This part is robust and correctly identifies and saves multiple paths ...
    if start_node_id not in G_directed or end_node_id not in G_directed or \
       start_node_id not in node_info or end_node_id not in node_info:
        print(f"    -> ERROR: Start/End node missing. Skipping."); return
    G_cooc_weighted = nx.Graph()
    for u, v in combinations(cooccurrence_matrix.columns, 2):
        if u in cooccurrence_matrix.index and v in cooccurrence_matrix.columns and u != v:
            score = cooccurrence_matrix.loc[u, v]
            if score > min_cooc_for_edge_in_path: G_cooc_weighted.add_edge(u, v, weight=score)
    if not G_cooc_weighted.has_node(start_node_id) or not G_cooc_weighted.has_node(end_node_id):
        print(f"    -> Start or End node not in the pruned co-occurrence graph. Cannot find paths.")
        pd.DataFrame(columns=['path_nodes', 'score', 'path_str', 'path_length', 'avg_cooc_score', 'num_explicit_links', 'hierarchical_flow_score', 'category_span_score'])\
            .to_csv(os.path.join(output_dir, f"top_trajectories_{start_node_id}_to_{end_node_id}.csv"), index=False)
        return
    all_found_paths = []
    for path in tqdm(nx.all_simple_paths(G_cooc_weighted, source=start_node_id, target=end_node_id, cutoff=max_path_len_for_search), desc="Finding paths..."):
        if len(path) >= 2: all_found_paths.append(path)
    scored_paths_list = []
    if not all_found_paths:
        best_path_nodes_for_vis = [start_node_id, end_node_id]
        df_paths_to_save = pd.DataFrame([{'path_nodes': best_path_nodes_for_vis, 'path_str': ' -> '.join(best_path_nodes_for_vis), 'score': 0, 'avg_cooc_score': 0, 'num_explicit_links':0, 'hierarchical_flow_score':0, 'category_span_score':0, 'path_length': 2}])
    else:
        for path in tqdm(all_found_paths, desc="Scoring Paths"):
            path_cooc_scores = []; explicit_links_count = 0; hierarchical_score = 0; path_categories_set = set()
            valid_path = True
            for i in range(len(path) - 1):
                u, v = path[i], path[i+1]
                if G_cooc_weighted.has_edge(u,v): path_cooc_scores.append(G_cooc_weighted[u][v]['weight'])
                else: valid_path = False; break
                if G_directed.has_edge(u,v): explicit_links_count += 1
                cat_u = node_info.get(u, {}).get('category'); cat_v = node_info.get(v, {}).get('category')
                if cat_u and cat_v and cat_u in CATEGORY_ORDER and cat_v in CATEGORY_ORDER:
                    if CATEGORY_ORDER.index(cat_v) >= CATEGORY_ORDER.index(cat_u): hierarchical_score += 1
                if cat_u: path_categories_set.add(cat_u)
            if path[-1] in node_info: path_categories_set.add(node_info[path[-1]]['category'])
            if not valid_path: continue
            avg_cooc = np.mean(path_cooc_scores) if path_cooc_scores else 0
            category_span_bonus = len(path_categories_set) if len(path_categories_set) >=3 else 0
            final_score = (avg_cooc * 10) + (explicit_links_count * 5) + (hierarchical_score * 2) + (category_span_bonus * 1)
            scored_paths_list.append({'path_nodes': path, 'score': final_score, 'path_length': len(path),'avg_cooc_score': round(avg_cooc, 3),'num_explicit_links': explicit_links_count,'hierarchical_flow_score': hierarchical_score,'category_span_score': category_span_bonus})
        if not scored_paths_list:
            best_path_nodes_for_vis = [start_node_id, end_node_id]
            df_paths_to_save = pd.DataFrame([{'path_nodes': best_path_nodes_for_vis,'path_str': ' -> '.join(best_path_nodes_for_vis),'score': 0, 'avg_cooc_score': 0, 'num_explicit_links':0, 'hierarchical_flow_score':0, 'category_span_score':0, 'path_length': 2}])
        else:
            df_paths_to_save = pd.DataFrame(scored_paths_list).sort_values(by='score', ascending=False)
            df_paths_to_save['path_str'] = df_paths_to_save['path_nodes'].apply(lambda x: ' -> '.join(x))
            best_path_nodes_for_vis = df_paths_to_save.iloc[0]['path_nodes']
    csv_output_path = os.path.join(output_dir, f"top_trajectories_{start_node_id}_to_{end_node_id}.csv")
    df_paths_to_save.head(top_n_paths_to_save).to_csv(csv_output_path, index=False)
    print(f"    -> Saved top {min(top_n_paths_to_save, len(df_paths_to_save))} trajectories to '{csv_output_path}'.")
    print(f"    -> Visualizing Best Trajectory: {' -> '.join(best_path_nodes_for_vis)}")


    # --- 4. DEFINITIVE VISUALIZATION with Spring Layout and Clear Edge Styling ---
    vis_G = nx.DiGraph()
    # Add nodes from the best path
    for node_id in best_path_nodes_for_vis:
        if node_id in node_info:
            vis_G.add_node(node_id, **node_info[node_id], on_path=True) # Keep 'on_path' attribute
    # Add edges for the best path
    main_path_edges_list = []
    for i in range(len(best_path_nodes_for_vis) - 1):
        u, v = best_path_nodes_for_vis[i], best_path_nodes_for_vis[i+1]
        if vis_G.has_node(u) and vis_G.has_node(v):
            vis_G.add_edge(u, v, type='main_path')
            main_path_edges_list.append((u,v))

    # Add COMMON SUCCESSORS of the original start and end nodes from G_directed
    support_edges_list = []
    if start_node_id in G_directed and end_node_id in G_directed:
        successors_start = set(G_directed.successors(start_node_id))
        successors_end = set(G_directed.successors(end_node_id))
        common_bridge_nodes = list(successors_start.intersection(successors_end))

        for bridge_node in common_bridge_nodes[:5]: # Limit for clarity
            if bridge_node not in vis_G and bridge_node in node_info:
                vis_G.add_node(bridge_node, **node_info[bridge_node], on_path=False)

            # Add support edges carefully, ensuring nodes exist in vis_G
            if vis_G.has_node(start_node_id) and vis_G.has_node(bridge_node):
                 if not vis_G.has_edge(start_node_id, bridge_node): # Avoid duplicate edges
                    vis_G.add_edge(start_node_id, bridge_node, type='support_link')
                    support_edges_list.append((start_node_id, bridge_node))
            if vis_G.has_node(bridge_node) and vis_G.has_node(end_node_id):
                 if not vis_G.has_edge(bridge_node, end_node_id):
                    vis_G.add_edge(bridge_node, end_node_id, type='support_link')
                    support_edges_list.append((bridge_node, end_node_id))

    if not vis_G.nodes():
        print("    -> No nodes to visualize for the path graph. Skipping visualization.")
        return

    # --- Use Spring Layout ---
    plt.figure(figsize=(22, 18)); ax = plt.gca() # Larger figure for spring layout
    pos = nx.spring_layout(vis_G, k=1.0, iterations=70, seed=42) # Adjust k and iterations as needed

    # Node styling
    node_colors = [d.get('color', 'grey') for n,d in vis_G.nodes(data=True)]
    node_sizes  = [6000 if d.get('on_path') else 2500 for n,d in vis_G.nodes(data=True)]
    node_outlines = ['yellow' if d.get('on_path') else 'black' for n,d in vis_G.nodes(data=True)]
    node_outline_widths = [4 if d.get('on_path') else 1.5 for n,d in vis_G.nodes(data=True)]

    nx.draw_networkx_nodes(ax=ax, G=vis_G, pos=pos, node_color=node_colors,
                           node_size=node_sizes, edgecolors=node_outlines, linewidths=node_outline_widths, alpha=0.9)

    # Edge styling
    nx.draw_networkx_edges(ax=ax, G=vis_G, pos=pos, edgelist=main_path_edges_list,
                           width=3.5, edge_color='black', style='solid', alpha=1.0, arrows=True,
                           arrowstyle='-|>', arrowsize=25, node_size=node_sizes, connectionstyle='arc3,rad=0.1')

    nx.draw_networkx_edges(ax=ax, G=vis_G, pos=pos, edgelist=support_edges_list,
                           width=1.0, edge_color='lightgrey', style='dashed', alpha=0.7, arrows=True,
                           arrowstyle='-|>', arrowsize=15, node_size=node_sizes, connectionstyle='arc3,rad=0.1')

    # Labeling
    labels = {}; texts = []
    for node_id in vis_G.nodes():
        cat = node_info.get(node_id, {}).get('category', 'Unk')
        name = node_id.replace('-', ' ').replace('_', ' ').title()
        words = name.split(); wrapped_name = "" ; current_line = ""
        max_chars = 16 if vis_G.nodes[node_id].get('on_path') else 12
        for word in words:
            if len(current_line + " " + word) > max_chars:
                wrapped_name += current_line.strip() + "\n"; current_line = word
            else: current_line += " " + word
        wrapped_name += current_line.strip()
        labels[node_id] = f"$\\bf{{{cat}}}$\n{wrapped_name}" if vis_G.nodes[node_id].get('on_path') else wrapped_name

    for node, p_val in pos.items():
      if node in vis_G.nodes:
        font_size = 9 if vis_G.nodes[node].get('on_path') else 8
        font_color = 'black'
        bbox_props = dict(boxstyle="round,pad=0.3", fc=node_info.get(node,{}).get('color','lightgrey'),
                          ec="black", alpha=0.85, lw=1.5 if vis_G.nodes[node].get('on_path') else 0.5) if vis_G.nodes[node].get('on_path') else None

        texts.append(ax.text(p_val[0], p_val[1], labels.get(node, ''), ha='center', va='center',
                             fontsize=font_size, weight='bold' if vis_G.nodes[node].get('on_path') else 'normal',
                             color=font_color, bbox=bbox_props ))

    if texts:
        adjust_text(texts, expand_points=(1.2,1.2), expand_text=(1.2,1.2),
                    force_points=0.5, force_text=0.5,
                    arrowprops=dict(arrowstyle="-", color='grey', lw=0.5, relpos=(0.5,0.5)))

    ax.set_title(f"Synthesized Research Trajectory: '{start_node_id}' to '{end_node_id}'", fontsize=28)
    ax.margins(0.1)
    plt.tight_layout()
    output_filename = os.path.join(output_dir, f"trajectory_{start_node_id}_to_{end_node_id}_network.png")
    plt.savefig(output_filename)
    plt.close()
    print(f"    -> Saved synthesized research trajectory network visualization to '{output_filename}'.\n")

def analyze_probabilistic_knowledge_gaps(G_directed, cooccurrence_matrix, node_info, output_dir):
    """
    Identifies and scores high-potential but non-existent links between all
    categories using a multi-evidence scoring approach (topological proximity,
    co-occurrence, and category bridge bonus). Saves the full list and a
    heatmap atlas.
    """
    print("--- Stage 4: The Probabilistic Knowledge Gap Engine ---")

    if not G_directed or G_directed.number_of_nodes() == 0 or cooccurrence_matrix.empty:
        print("    -> Input graph or co-occurrence matrix is empty. Skipping gap analysis.")
        return None

    nodes_by_cat = {cat[0]: [n for n, d in node_info.items() if d['category'] == cat[0] and n in G_directed]
                    for cat in NODE_CATEGORIES.values()}
    all_potential_links = []

    # Iterate through all unique pairs of categories
    for cat1, cat2 in combinations(CATEGORY_ORDER, 2):
        print(f"    -> Scoring gaps between {cat1} and {cat2}...")
        for u in nodes_by_cat.get(cat1, []):
            for v in nodes_by_cat.get(cat2, []):
                # Ensure nodes exist and are different
                if u == v or not G_directed.has_node(u) or not G_directed.has_node(v):
                    continue

                # Check if a link already exists in either direction
                if not G_directed.has_edge(u, v) and not G_directed.has_edge(v, u):

                    # Score 1: Explicit Topological Proximity (Common Successors in G_directed)
                    successors_u = set(G_directed.successors(u))
                    successors_v = set(G_directed.successors(v))
                    topo_score = len(successors_u.intersection(successors_v))

                    # Score 2: Co-occurrence Strength (from cooccurrence_matrix)
                    cooc_score = 0.0 # Default to 0 if nodes not in matrix
                    if u in cooccurrence_matrix.index and v in cooccurrence_matrix.columns:
                        cooc_score = cooccurrence_matrix.loc[u, v]

                    # Score 3: Category Bridge Bonus
                    bridge_bonus = 0.0
                    # Example: High bonus for Theory -> Application or Material -> Application
                    if (node_info[u]['category'] == 'Theory' and node_info[v]['category'] == 'Application') or \
                       (node_info[v]['category'] == 'Theory' and node_info[u]['category'] == 'Application'):
                        bridge_bonus = 1.5
                    elif (node_info[u]['category'] == 'Material' and node_info[v]['category'] == 'Application') or \
                         (node_info[v]['category'] == 'Material' and node_info[u]['category'] == 'Application'):
                        bridge_bonus = 1.0

                    # Combined Score (Weighted sum - weights can be tuned)
                    # Ensure cooc_score is positive for addition; negative correlations are not "gaps" in this context
                    predicted_link_strength = (2.0 * topo_score) + (1.0 * max(0, cooc_score)) + bridge_bonus

                    if predicted_link_strength > 1.0: # Threshold for a meaningful potential link
                        all_potential_links.append({
                            'Source_Category': node_info[u]['category'], 'Source_Node': u,
                            'Target_Category': node_info[v]['category'], 'Target_Node': v,
                            'Topological_Score': topo_score,
                            'Cooccurrence_Score': round(cooc_score, 3),
                            'Bridge_Bonus': bridge_bonus,
                            'Predicted_Link_Strength': round(predicted_link_strength, 3)
                        })

    if not all_potential_links:
        print("    -> No significant potential links found after scoring. Atlas not generated.")
        return None

    df_gaps = pd.DataFrame(all_potential_links).sort_values(by='Predicted_Link_Strength', ascending=False)
    df_gaps.to_csv(os.path.join(output_dir, "probabilistic_knowledge_gaps_full_list.csv"), index=False)
    print(f"    -> Saved full list of {len(df_gaps)} probabilistic links.")

    # Create the Atlas Heatmap (max Predicted_Link_Strength between categories)
    atlas_matrix = df_gaps.groupby(['Source_Category', 'Target_Category'])['Predicted_Link_Strength'].max().unstack(fill_value=0)
    # Ensure all categories are present and in order
    atlas_matrix = atlas_matrix.reindex(index=CATEGORY_ORDER, columns=CATEGORY_ORDER, fill_value=0)
    # Make it symmetric for easier reading (e.g., Theory-App is same as App-Theory)
    for cat_pair in combinations(CATEGORY_ORDER, 2):
        val1 = atlas_matrix.loc[cat_pair[0], cat_pair[1]]
        val2 = atlas_matrix.loc[cat_pair[1], cat_pair[0]]
        max_val = max(val1, val2)
        atlas_matrix.loc[cat_pair[0], cat_pair[1]] = max_val
        atlas_matrix.loc[cat_pair[1], cat_pair[0]] = max_val

    plt.figure(figsize=(12, 10))
    sns.heatmap(atlas_matrix, annot=True, cmap="YlGnBu", fmt=".1f", linewidths=.5, cbar_kws={'label': 'Max Predicted Link Strength'})
    plt.title("The Probabilistic Knowledge Gap Atlas", fontsize=20)
    plt.xlabel("Target Concept Category", fontsize=12)
    plt.ylabel("Source Concept Category", fontsize=12)
    plt.xticks(rotation=45, ha='right')
    plt.yticks(rotation=0)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "probabilistic_knowledge_gap_atlas.png"))
    plt.close()
    print("    -> Saved Probabilistic Knowledge Gap Atlas heatmap.\n")

    return df_gaps

def analyze_centrality_and_communities(G_directed, node_info, output_dir):
    """
    Calculates centrality, detects communities (silos), saves results,
    and visualizes the conceptual landscape. Adds PageRank and community
    ID as node attributes to G_directed.
    """
    print("--- Stage 2: Landscape and Centrality Analysis ---")

    if not G_directed or G_directed.number_of_nodes() == 0:
        print("    -> Explicit link graph (G_directed) is empty. Skipping this stage.")
        return G_directed

    # --- a. Centrality Analysis ---
    print("    -> Calculating centrality scores...")
    degree_cent = nx.degree_centrality(G_directed)
    betweenness_cent = nx.betweenness_centrality(G_directed)
    pagerank_cent = nx.pagerank(G_directed) # This is the correct variable

    nx.set_node_attributes(G_directed, pagerank_cent, 'pagerank')

    centrality_df = pd.DataFrame({
        'Degree': degree_cent,
        'Betweenness': betweenness_cent,
        'PageRank': pagerank_cent
    }).sort_values('PageRank', ascending=False)

    centrality_df.head(20).to_csv(os.path.join(output_dir, "top_20_influential_concepts.csv"))

    fig_cent, axes_cent = plt.subplots(3, 1, figsize=(12, 18))
    fig_cent.suptitle("Top 10 Intellectual Hubs by Centrality", fontsize=20)
    for i, metric in enumerate(centrality_df.columns):
        data_to_plot = centrality_df[metric].nlargest(10)
        sns.barplot(x=data_to_plot.values, y=data_to_plot.index, ax=axes_cent[i], palette='viridis')
        axes_cent[i].set_title(f"{metric} Centrality", fontsize=16)
    plt.tight_layout(rect=[0, 0, 1, 0.96]); plt.savefig(os.path.join(output_dir, "centrality_analysis.png")); plt.close(fig_cent)
    print("    -> Saved centrality analysis plot.")

    # --- b. Community Detection (Research Silos) ---
    print("    -> Detecting research silos (communities)...")
    G_undirected = G_directed.to_undirected()
    if G_undirected.number_of_nodes() == 0: return G_directed

    partition = community_louvain.best_partition(G_undirected, random_state=42)
    nx.set_node_attributes(G_directed, partition, 'community')

    df_partition = pd.DataFrame(partition.items(), columns=['Node', 'CommunityID'])
    df_partition['Category'] = df_partition['Node'].map({n: d.get('category') for n, d in node_info.items()})
    df_partition.sort_values(by=['CommunityID', 'Node']).to_csv(os.path.join(output_dir, "concept_communities.csv"), index=False)
    num_communities = df_partition['CommunityID'].nunique()
    print(f"    -> Found {num_communities} communities. Saved to CSV.")

    nodes_in_communities = [n for n in G_undirected.nodes() if n in partition]
    if not nodes_in_communities: return G_directed
    subgraph_for_layout = G_undirected.subgraph(nodes_in_communities)
    if subgraph_for_layout.number_of_nodes() == 0: return G_directed

    plt.figure(figsize=(28, 28)); ax_comm = plt.gca()
    pos = nx.spring_layout(subgraph_for_layout, k=0.3, iterations=70, seed=42, weight=None)
    node_colors_for_plot = [partition.get(node, -1) for node in subgraph_for_layout.nodes()]

    # --- FIX: Use the correct variable name 'pagerank_cent' ---
    node_sizes_for_plot = [pagerank_cent.get(node, 0.0001) * 100000 + 100 for node in subgraph_for_layout.nodes()]
    # --- END OF FIX ---

    nx.draw(subgraph_for_layout, pos, ax=ax_comm, with_labels=False, node_color=node_colors_for_plot, cmap=plt.get_cmap('tab20'),
            node_size=node_sizes_for_plot, width=0.3, alpha=0.8, edge_color='silver')

    top_overall_nodes = centrality_df.head(30).index.tolist()
    labels_to_draw = {node: node.replace('-', ' ').title() for node in top_overall_nodes if node in subgraph_for_layout.nodes() and node in pos}

    texts = [ax_comm.text(pos[node][0], pos[node][1], label_text, ha='center', va='center', fontsize=10, weight='bold',
                          bbox=dict(boxstyle="round,pad=0.2", fc=node_info.get(node, {'color':'lightgrey'})['color'], alpha=0.6))
             for node, label_text in labels_to_draw.items() if node in pos]
    if texts: adjust_text(texts, arrowprops=dict(arrowstyle="-", color='black', lw=0.5))

    ax_comm.set_title("The Conceptual Landscape: A Map of Research Silos", fontsize=32); ax_comm.axis('off')
    plt.savefig(os.path.join(output_dir, "conceptual_landscape_map_silos.png")); plt.close()
    print("    -> Saved conceptual landscape map (silo view).\n")
    return G_directed

#===========================================================================
# MAIN ORCHESTRATION SCRIPT (Adjusted for new function)
#===========================================================================
def main():
    """Runs the full analysis pipeline for the knowledge graph."""
    print("="*60); print("  The Definitive Knowledge Discovery and Synthesis Pipeline"); print("="*60)
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    node_info = get_node_metadata(MARKDOWN_FILES)
    G_directed = build_explicit_link_graph(MARKDOWN_FILES, node_info)
    # Pre-calculate PageRank and add as a node attribute for use in multiple functions
    pagerank_values = nx.pagerank(G_directed)
    nx.set_node_attributes(G_directed, pagerank_values, 'pagerank')

    cooccurrence_matrix = build_cooccurrence_data(MARKDOWN_FILES, node_info)

    # --- FIX: Create directories BEFORE calling functions that save into them ---
    # Stage 1: Master Node List
    dir1 = os.path.join(OUTPUT_DIR, "1_Master_Node_List"); os.makedirs(dir1, exist_ok=True)

    # Stage 2: Conceptual Landscape (Centrality and Communities)
    dir2 = os.path.join(OUTPUT_DIR, "2_Landscape_Analysis"); os.makedirs(dir2, exist_ok=True)

    # Stage 3: Innovation Strategies
    dir3 = os.path.join(OUTPUT_DIR, "3_Innovation_Strategies"); os.makedirs(dir3, exist_ok=True)

    # Stage 4: Probabilistic Knowledge Gap Atlas
    dir4 = os.path.join(OUTPUT_DIR, "4_Knowledge_Gap_Atlas"); os.makedirs(dir4, exist_ok=True)

    # Stage 5: Causal Research Trajectory Synthesis
    dir5 = os.path.join(OUTPUT_DIR, "5_Research_Trajectory_Synthesis"); os.makedirs(dir5, exist_ok=True)
    # --- END FIX ---

    # --- Now, run the full pipeline ---

    # Call Innovation Strategies first as its output DataFrame is needed for create_and_save_node_list
    innovation_scores_df = analyze_innovation_strategies(G_directed, cooccurrence_matrix, node_info, dir3)

    # Stage 1 Call (after innovation scores are available)
    create_and_save_node_list(G_directed, innovation_scores_df, dir1)

    # Stage 2 Call
    # analyze_centrality_and_communities also adds 'community' attribute to G_directed
    G_with_communities = analyze_centrality_and_communities(G_directed, node_info, dir2)

    # Stage 4 Call
    gap_df = analyze_probabilistic_knowledge_gaps(G_with_communities, cooccurrence_matrix, node_info, dir4)

    # Stage 5 Call
    synthesize_and_plot_trajectory(
        G_directed=G_with_communities,
        cooccurrence_matrix=cooccurrence_matrix,
        node_info=node_info,
        df_gaps=gap_df,
        output_dir=dir5,
        start_node_id='nanowires',  # Explicitly named
        end_node_id='neuromorphic-computing--hardware' # Explicitly named
    )

# You could add more calls here for other interesting start/end pairs if desired
# For example, if df_gaps exists and has other high-scoring Theory->Application links:
# if gap_df is not None and not gap_df.empty:
#     theory_to_app_gaps = gap_df[(gap_df['Source_Category'] == 'Theory') & (gap_df['Target_Category'] == 'Application')]
#     for _, row in theory_to_app_gaps.head(2).iterrows(): # Plot for top 2 Theory->App gaps
#         if row['Source'] != 'nanowires': # Avoid re-plotting the first one
#             synthesize_and_plot_trajectory(G_with_communities, cooccurrence_matrix, gap_df, node_info, dir5,
#                                            start_node_id=row['Source'],
#                                            end_node_id=row['Target'])

    print("\n--- Analysis Pipeline Complete ---")
    print(f"Check the '{OUTPUT_DIR}' directory for all generated results.")


if __name__ == "__main__":
    main()

