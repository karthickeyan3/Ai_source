# Sport Weighting Blueprints

This document outlines the athletic attribute weights used by the SRS Recommendation Engine to identify sports suitability.

| Sport | Speed | Agility | Power | Endurance | Strength | Flexibility | Jumping |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Basketball** | 18% | 25% | 15% | 10% | 10% | 10% | 12% |
| **Soccer** | 20% | 20% | 15% | 15% | 10% | 5% | 15% |
| **Cricket** | 15% | 25% | 10% | 20% | 10% | 15% | 5% |
| **Tennis** | 15% | 20% | 15% | 15% | 10% | 15% | 10% |
| **Volleyball** | 15% | 20% | 15% | 15% | 10% | 10% | 15% |
| **Cycling** | 10% | 10% | 20% | 30% | 20% | 5% | 5% |
| **Gymnastics** | 10% | 20% | 15% | 10% | 15% | 20% | 10% |
| **Rowing** | 10% | 10% | 25% | 25% | 20% | 5% | 5% |
| **Swimming - Sprint (50m/100m)** | 25% | 10% | 25% | 15% | 15% | 10% | 0% |
| **Swimming - Distance (400m/1500m)** | 10% | 10% | 15% | 30% | 15% | 10% | 10% |
| **Track & Field - Sprint (100m/200m)** | 30% | 10% | 25% | 5% | 10% | 10% | 10% |
| **Track & Field - Middle Distance** | 15% | 10% | 15% | 30% | 10% | 10% | 10% |
| **Track & Field - Long Distance** | 10% | 10% | 10% | 30% | 15% | 15% | 10% |
| **Track & Field - High Jump** | 10% | 10% | 25% | 5% | 10% | 15% | 25% |
| **Track & Field - Long Jump** | 25% | 10% | 25% | 5% | 10% | 5% | 20% |
| **Track & Field - Triple Jump** | 20% | 10% | 25% | 5% | 15% | 5% | 20% |
| **Track & Field - Throws** | 10% | 5% | 25% | 10% | 30% | 10% | 10% |

---

## Technical Notes

### Attribute Generation (Metric Mapping)
The percentages above are applied to the following calculated attributes:

1. **Speed**: 40m Sprint (100%)
2. **Agility**: T-Test (60%) + Response Time (40%)
3. **Power**: Vertical Jump (60%) + Reaction Time (40%)
4. **Endurance**: Plank Test (100%)
5. **Strength**: Shoulder Girth (100%)
6. **Flexibility**: Sit & Reach (100%)
7. **Jumping**: Hip-to-Toe Ratio (100%)

### Scoring Formula
`Match Score = Σ (Attribute % × Sport Weight) / Total Weight`
