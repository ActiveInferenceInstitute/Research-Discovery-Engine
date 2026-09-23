# A synthetic protein-level neural network in mammalian cells

__Paper Type:__ Hybrid

## M1: System Overview & Implementation
*   **Vector ID:** M1
*   **Vector Type:** Overview

### **1.1 System Description**

*   **Vector ID:** M1.1
*   **Vector Type:** Description
    *   Content: The system is a synthetic protein circuit implemented in mammalian cells (HEK293T) designed to perform winner-take-all (WTA) neural network computation entirely at the protein level. Its purpose is to classify molecular signals based on their relative concentrations. The core components are engineered fusion proteins combining de novo designed heterodimers (DHDs) for input sensing and weighting, split viral proteases (TEVp and TVMVp) for signal processing and mutual inhibition, and degrons (DHFR-based) for controlling protein stability and implementing self-activation. Input proteins (DHD binders) regulate the reconstitution of split proteases. The reconstituted proteases can cleave degrons from themselves (self-activation) and cleave dimerization domains fused to the *other* protease type (mutual inhibition). The protease with the higher activity (driven by higher corresponding input concentration and weight) dominates, cleaving the opposing protease components and stabilizing