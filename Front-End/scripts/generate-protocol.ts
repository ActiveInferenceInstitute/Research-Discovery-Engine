#!/usr/bin/env tsx
/**
 * Standalone Protocol Generator Script
 * 
 * This script can be run independently to generate experimental protocols
 * from concept definitions. It demonstrates how the protocol generation
 * utilities can be used outside the main application.
 * 
 * Usage:
 *   npx tsx DE/scripts/generate-protocol.ts [options]
 *   node DE/scripts/generate-protocol.js [options]
 * 
 * Options:
 *   --objective "Your concept objective"
 *   --materials "material1,material2,material3"
 *   --mechanisms "mechanism1,mechanism2"
 *   --detail-level basic|intermediate|advanced
 *   --output-file path/to/output.md
 *   --headless                            Enable headless mode with file output
 *   --headless-output ./path              Custom output directory for headless mode
 */

import { generateProtocol, formatProtocolAsMarkdown, createStandaloneProtocol } from '../src/utils/protocolGenerator';
import { ConceptDesignState } from '../src/types';
import fs from 'fs';
import path from 'path';

interface CliOptions {
  objective?: string;
  materials?: string[];
  mechanisms?: string[];
  methods?: string[];
  detailLevel?: 'basic' | 'intermediate' | 'advanced';
  outputFile?: string;
  headless?: boolean;
  headlessOutput?: string;
  help?: boolean;
}

/**
 * Parse command line arguments
 */
function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  const options: CliOptions = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--help':
      case '-h':
        options.help = true;
        break;
      case '--objective':
        options.objective = args[++i];
        break;
      case '--materials':
        options.materials = args[++i]?.split(',').map(s => s.trim()) || [];
        break;
      case '--mechanisms':
        options.mechanisms = args[++i]?.split(',').map(s => s.trim()) || [];
        break;
      case '--methods':
        options.methods = args[++i]?.split(',').map(s => s.trim()) || [];
        break;
      case '--detail-level':
        const level = args[++i];
        if (['basic', 'intermediate', 'advanced'].includes(level)) {
          options.detailLevel = level as 'basic' | 'intermediate' | 'advanced';
        }
        break;
      case '--output-file':
        options.outputFile = args[++i];
        break;
    }
  }

  return options;
}

/**
 * Display help information
 */
function showHelp() {
  console.log(`
Standalone Protocol Generator

Usage:
  npx tsx DE/scripts/generate-protocol.ts [options]

Options:
  --objective "text"        Concept objective (required)
  --materials "a,b,c"       Comma-separated materials list
  --mechanisms "x,y,z"      Comma-separated mechanisms list
  --methods "m1,m2"         Comma-separated methods list
  --detail-level level      Detail level: basic, intermediate, advanced
  --output-file path        Output file path (optional, prints to console if not specified)
  --help, -h               Show this help message

Examples:
  # Basic protocol generation
  npx tsx DE/scripts/generate-protocol.ts \\
    --objective "Smart hydrogel actuator" \\
    --materials "PEG_Hydrogel,Iron_Nanoparticles" \\
    --mechanisms "Magnetic_Actuation,Swelling"

  # Advanced protocol with output file
  npx tsx DE/scripts/generate-protocol.ts \\
    --objective "Adaptive memristor network" \\
    --materials "Silver_Nanowires,PEDOT_PSS" \\
    --mechanisms "Synaptic_Plasticity,Conductance_Switching" \\
    --detail-level advanced \\
    --output-file ./protocols/memristor-protocol.md

  # Interactive mode (prompts for input)
  npx tsx DE/scripts/generate-protocol.ts
`);
}

/**
 * Interactive input gathering
 */
async function gatherInteractiveInput(): Promise<CliOptions> {
  const readline = await import('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (prompt: string): Promise<string> => {
    return new Promise(resolve => rl.question(prompt, resolve));
  };

  console.log('\n🧪 Interactive Protocol Generator\n');

  const objective = await question('Enter concept objective: ');
  const materialsInput = await question('Enter materials (comma-separated, optional): ');
  const mechanismsInput = await question('Enter mechanisms (comma-separated, optional): ');
  const methodsInput = await question('Enter methods (comma-separated, optional): ');
  const detailLevelInput = await question('Detail level (basic/intermediate/advanced, default: intermediate): ');
  const outputFileInput = await question('Output file path (optional, prints to console if empty): ');

  rl.close();

  return {
    objective: objective.trim() || undefined,
    materials: materialsInput.trim() ? materialsInput.split(',').map(s => s.trim()) : [],
    mechanisms: mechanismsInput.trim() ? mechanismsInput.split(',').map(s => s.trim()) : [],
    methods: methodsInput.trim() ? methodsInput.split(',').map(s => s.trim()) : [],
    detailLevel: (['basic', 'intermediate', 'advanced'].includes(detailLevelInput.trim()) 
      ? detailLevelInput.trim() as 'basic' | 'intermediate' | 'advanced' 
      : 'intermediate'),
    outputFile: outputFileInput.trim() || undefined
  };
}

/**
 * Create sample concept data for demonstration
 */
function createSampleConcept(): Partial<ConceptDesignState> {
  return {
    objective: "Smart Responsive Hydrogel Actuator",
    components: {
      materials: ["PEG_Hydrogel", "Iron_Nanoparticles", "Crosslinking_Agent"],
      mechanisms: ["Magnetic_Actuation", "pH_Response", "Thermal_Expansion"],
      methods: ["Sol_Gel_Synthesis", "Magnetic_Field_Application", "pH_Titration"],
      theoretical_concepts: ["Polymer_Network_Theory", "Magnetic_Coupling"]
    },
    cssVectorDraft: {
      context: {
        material_primary: ["PEG_Hydrogel", "Iron_Nanoparticles"],
        fabrication_primary: ["Sol_Gel_Synthesis", "Crosslinking"],
        environment_type: "Aqueous_Solution",
        morphology_type: "3D_Network",
        morphology_scale: "Millimeter"
      },
      interface: {
        input_mechanism: ["Magnetic_Field", "pH_Change"],
        output_mechanism: ["Mechanical_Deformation", "Volume_Change"]
      },
      constraints: {
        objective_type: "Controllable_Actuation"
      }
    }
  };
}

/**
 * Main execution function
 */
async function main() {
  console.log('🔬 Research Discovery Engine - Protocol Generator\n');

  const options = parseArgs();

  if (options.help) {
    showHelp();
    return;
  }

  let finalOptions: CliOptions;

  // If no objective provided, check if we should use interactive mode or sample
  if (!options.objective) {
    const hasOtherArgs = options.materials?.length || options.mechanisms?.length || options.outputFile;
    
    if (!hasOtherArgs && process.stdin.isTTY) {
      // Interactive mode
      finalOptions = await gatherInteractiveInput();
    } else if (!hasOtherArgs) {
      // Use sample data for demonstration
      console.log('📝 No objective provided. Using sample concept for demonstration.\n');
      const sampleConcept = createSampleConcept();
      finalOptions = {
        objective: sampleConcept.objective,
        materials: sampleConcept.components?.materials,
        mechanisms: sampleConcept.components?.mechanisms,
        methods: sampleConcept.components?.methods,
        detailLevel: 'intermediate'
      };
    } else {
      console.error('❌ Error: --objective is required when using other options.');
      console.log('Use --help for usage information.');
      process.exit(1);
    }
  } else {
    finalOptions = options;
  }

  if (!finalOptions.objective) {
    console.error('❌ Error: Objective is required.');
    process.exit(1);
  }

  try {
    console.log('🔄 Generating protocol...\n');

    // Create concept data
    const conceptData: Partial<ConceptDesignState> = {
      objective: finalOptions.objective,
      components: {
        materials: finalOptions.materials || [],
        mechanisms: finalOptions.mechanisms || [],
        methods: finalOptions.methods || [],
        theoretical_concepts: []
      }
    };

    // Generate protocol using standalone function
    const { protocol, markdown } = createStandaloneProtocol(conceptData, {
      detailLevel: finalOptions.detailLevel || 'intermediate',
      includeTimeEstimates: true,
      includeRiskAssessment: false,
      outputFormat: 'markdown'
    });

    // Output results
    if (finalOptions.outputFile) {
      // Ensure output directory exists
      const outputDir = path.dirname(finalOptions.outputFile);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Write to file
      fs.writeFileSync(finalOptions.outputFile, markdown, 'utf8');
      console.log(`✅ Protocol generated successfully!`);
      console.log(`📄 Output written to: ${finalOptions.outputFile}`);
      console.log(`📊 Protocol sections: ${protocol.sections.length}`);
      console.log(`⏱️  Estimated duration: ${protocol.metadata.estimatedDuration}`);
      console.log(`🎯 Skill level: ${protocol.metadata.skillLevel}`);
    } else {
      // Print to console
      console.log('✅ Protocol generated successfully!\n');
      console.log('📄 Protocol Content:');
      console.log('═'.repeat(60));
      console.log(markdown);
      console.log('═'.repeat(60));
      console.log(`\n📊 Protocol Metadata:`);
      console.log(`   Sections: ${protocol.sections.length}`);
      console.log(`   Estimated Duration: ${protocol.metadata.estimatedDuration}`);
      console.log(`   Skill Level: ${protocol.metadata.skillLevel}`);
      console.log(`   Materials: ${protocol.metadata.materials.join(', ') || 'None specified'}`);
      console.log(`   Mechanisms: ${protocol.metadata.mechanisms.join(', ') || 'None specified'}`);
    }

  } catch (error) {
    console.error('❌ Error generating protocol:', error);
    process.exit(1);
  }
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });
} 