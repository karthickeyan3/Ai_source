import type { SportNorms, NormativeBreakpoints } from '../types';

/**
 * Core Normative Data for all sports (Ages 10-16).
 * Based on High-Performance Athletic Standards ("Ligits").
 */
export const normativeData: { [key: string]: SportNorms } = {
    'Basketball': {
        Male: {
            '10': {
                height: { p10: 128, p25: 133, p50: 138, p75: 144, p90: 150 },
                weight: { p10: 24, p25: 28, p50: 32, p75: 42, p90: 52 },
                bmi: { p10: 14.0, p25: 16.0, p50: 17.5, p75: 20.0, p90: 22.0 },
                shoulderGirth: { p10: 28, p25: 30, p50: 32, p75: 34, p90: 36 },
                hipCircumference: { p10: 62, p25: 66, p50: 70, p75: 78, p90: 84 },
                waistCircumference: { p10: 75, p25: 68, p50: 62, p75: 58, p90: 54 },
                skinfold: { p10: 22, p25: 18, p50: 14, p75: 10, p90: 7 },
                hipToToe: { p10: 62, p25: 66, p50: 70, p75: 75, p90: 80 },
                verticalJump: { p10: 15, p25: 22, p50: 28, p75: 35, p90: 42 },
                sitAndReach: { p10: 8, p25: 14, p50: 20, p75: 26, p90: 32 },
                plankTest: { p10: 30, p25: 45, p50: 60, p75: 85, p90: 110 },
                tTest: { p10: 16.5, p25: 15.2, p50: 14.2, p75: 13.0, p90: 11.8 },
                reactionTime: { p10: 0.85, p25: 0.70, p50: 0.55, p75: 0.45, p90: 0.35 },
                responseTime: { p10: 1.30, p25: 1.10, p50: 0.85, p75: 0.65, p90: 0.50 },
                sprint40m: { p10: 9.2, p25: 8.5, p50: 7.8, p75: 7.0, p90: 6.4 },
            },
            '11': {
                height: { p10: 133, p25: 138, p50: 144, p75: 150, p90: 158 },
                weight: { p10: 26, p25: 30, p50: 36, p75: 46, p90: 56 },
                bmi: { p10: 15.0, p25: 16.5, p50: 18.0, p75: 20.5, p90: 22.5 },
                shoulderGirth: { p10: 29, p25: 31, p50: 33, p75: 35, p90: 37 },
                hipCircumference: { p10: 65, p25: 70, p50: 74, p75: 82, p90: 88 },
                waistCircumference: { p10: 78, p25: 70, p50: 64, p75: 60, p90: 56 },
                skinfold: { p10: 22, p25: 18, p50: 14, p75: 10, p90: 7 },
                hipToToe: { p10: 66, p25: 70, p50: 74, p75: 80, p90: 86 },
                verticalJump: { p10: 18, p25: 25, p50: 32, p75: 40, p90: 48 },
                sitAndReach: { p10: 10, p25: 16, p50: 22, p75: 28, p90: 34 },
                plankTest: { p10: 40, p25: 55, p50: 75, p75: 105, p90: 135 },
                tTest: { p10: 15.5, p25: 14.5, p50: 13.5, p75: 12.5, p90: 11.2 },
                reactionTime: { p10: 0.80, p25: 0.65, p50: 0.52, p75: 0.42, p90: 0.33 },
                responseTime: { p10: 1.25, p25: 1.05, p50: 0.82, p75: 0.62, p90: 0.48 },
                sprint40m: { p10: 8.8, p25: 8.0, p50: 7.2, p75: 6.6, p90: 6.0 },
            },
            '12': {
                height: { p10: 138, p25: 144, p50: 150, p75: 158, p90: 165 },
                weight: { p10: 30, p25: 34, p50: 40, p75: 52, p90: 65 },
                bmi: { p10: 15.5, p25: 17.0, p50: 18.5, p75: 21.0, p90: 23.0 },
                shoulderGirth: { p10: 30, p25: 32, p50: 34, p75: 37, p90: 39 },
                hipCircumference: { p10: 70, p25: 74, p50: 78, p75: 86, p90: 94 },
                waistCircumference: { p10: 82, p25: 74, p50: 67, p75: 62, p90: 58 },
                skinfold: { p10: 22, p25: 18, p50: 14, p75: 10, p90: 7 },
                hipToToe: { p10: 70, p25: 74, p50: 78, p75: 85, p90: 92 },
                verticalJump: { p10: 22, p25: 28, p50: 36, p75: 44, p90: 52 },
                sitAndReach: { p10: 12, p25: 18, p50: 24, p75: 30, p90: 36 },
                plankTest: { p10: 50, p25: 70, p50: 95, p75: 130, p90: 165 },
                tTest: { p10: 14.5, p25: 13.5, p50: 12.6, p75: 11.8, p90: 10.8 },
                reactionTime: { p10: 0.75, p25: 0.60, p50: 0.49, p75: 0.40, p90: 0.31 },
                responseTime: { p10: 1.20, p25: 1.00, p50: 0.79, p75: 0.59, p90: 0.46 },
                sprint40m: { p10: 8.4, p25: 7.6, p50: 6.8, p75: 6.2, p90: 5.4 },
            },
            '13': {
                height: { p10: 145, p25: 151, p50: 157, p75: 166, p90: 175 },
                weight: { p10: 35, p25: 40, p50: 46, p75: 60, p90: 75 },
                bmi: { p10: 16.0, p25: 17.5, p50: 19.0, p75: 21.5, p90: 23.5 },
                shoulderGirth: { p10: 32, p25: 34, p50: 36, p75: 39, p90: 41 },
                hipCircumference: { p10: 75, p25: 79, p50: 83, p75: 91, p90: 98 },
                waistCircumference: { p10: 85, p25: 78, p50: 71, p75: 66, p90: 62 },
                skinfold: { p10: 22, p25: 18, p50: 14, p75: 10, p90: 7 },
                hipToToe: { p10: 75, p25: 80, p50: 86, p75: 92, p90: 100 },
                verticalJump: { p10: 26, p25: 32, p50: 40, p75: 48, p90: 58 },
                sitAndReach: { p10: 14, p25: 20, p50: 28, p75: 34, p90: 42 },
                plankTest: { p10: 60, p25: 80, p50: 105, p75: 145, p90: 185 },
                tTest: { p10: 14.0, p25: 13.0, p50: 12.0, p75: 11.2, p90: 10.2 },
                reactionTime: { p10: 0.70, p25: 0.55, p50: 0.46, p75: 0.38, p90: 0.29 },
                responseTime: { p10: 1.15, p25: 0.95, p50: 0.75, p75: 0.56, p90: 0.44 },
                sprint40m: { p10: 8.0, p25: 7.2, p50: 6.5, p75: 5.8, p90: 5.2 },
            },
            '14': {
                height: { p10: 155, p25: 160, p50: 164, p75: 172, p90: 182 },
                weight: { p10: 42, p25: 48, p50: 54, p75: 68, p90: 82 },
                bmi: { p10: 16.5, p25: 18.0, p50: 19.5, p75: 22.0, p90: 24.0 },
                shoulderGirth: { p10: 34, p25: 36, p50: 38, p75: 41, p90: 43 },
                hipCircumference: { p10: 80, p25: 84, p50: 88, p75: 96, p90: 104 },
                waistCircumference: { p10: 88, p25: 82, p50: 75, p75: 70, p90: 66 },
                skinfold: { p10: 22, p25: 18, p50: 14, p75: 10, p90: 7 },
                hipToToe: { p10: 80, p25: 85, p50: 92, p75: 100, p90: 108 },
                verticalJump: { p10: 30, p25: 36, p50: 44, p75: 54, p90: 64 },
                sitAndReach: { p10: 16, p25: 22, p50: 30, p75: 38, p90: 46 },
                plankTest: { p10: 75, p25: 100, p50: 125, p75: 170, p90: 215 },
                tTest: { p10: 13.5, p25: 12.5, p50: 11.4, p75: 10.6, p90: 9.6 },
                reactionTime: { p10: 0.65, p25: 0.51, p50: 0.43, p75: 0.35, p90: 0.27 },
                responseTime: { p10: 1.10, p25: 0.90, p50: 0.72, p75: 0.53, p90: 0.42 },
                sprint40m: { p10: 7.4, p25: 6.7, p50: 6.2, p75: 5.6, p90: 4.8 },
            },
            '15': {
                height: { p10: 162, p25: 166, p50: 170, p75: 178, p90: 188 },
                weight: { p10: 48, p25: 55, p50: 61, p75: 75, p90: 90 },
                bmi: { p10: 17.0, p25: 18.5, p50: 20.0, p75: 22.5, p90: 24.5 },
                shoulderGirth: { p10: 35, p25: 37, p50: 39, p75: 42, p90: 45 },
                hipCircumference: { p10: 84, p25: 88, p50: 93, p75: 100, p90: 110 },
                waistCircumference: { p10: 92, p25: 86, p50: 78, p75: 73, p90: 69 },
                skinfold: { p10: 22, p25: 18, p50: 14, p75: 10, p90: 7 },
                hipToToe: { p10: 85, p25: 92, p50: 100, p75: 108, p90: 116 },
                verticalJump: { p10: 32, p25: 42, p50: 52, p75: 62, p90: 72 },
                sitAndReach: { p10: 18, p25: 26, p50: 34, p75: 42, p90: 50 },
                plankTest: { p10: 90, p25: 115, p50: 140, p75: 195, p90: 250 },
                tTest: { p10: 13.0, p25: 12.0, p50: 11.0, p75: 10.2, p90: 9.2 },
                reactionTime: { p10: 0.60, p25: 0.48, p50: 0.40, p75: 0.33, p90: 0.25 },
                responseTime: { p10: 1.05, p25: 0.85, p50: 0.68, p75: 0.50, p90: 0.40 },
                sprint40m: { p10: 7.0, p25: 6.4, p50: 5.8, p75: 5.2, p90: 4.6 },
            },
            '16': {
                height: { p10: 165, p25: 170, p50: 174, p75: 182, p90: 194 },
                weight: { p10: 52, p25: 58, p50: 66, p75: 80, p90: 95 },
                bmi: { p10: 17.5, p25: 19.0, p50: 20.5, p75: 23.0, p90: 25.0 },
                shoulderGirth: { p10: 36, p25: 38, p50: 41, p75: 44, p90: 48 },
                hipCircumference: { p10: 88, p25: 93, p50: 98, p75: 108, p90: 118 },
                waistCircumference: { p10: 95, p25: 90, p50: 82, p75: 76, p90: 72 },
                skinfold: { p10: 22, p25: 18, p50: 14, p75: 10, p90: 7 },
                hipToToe: { p10: 90, p25: 96, p50: 104, p75: 115, p90: 124 },
                verticalJump: { p10: 35, p25: 46, p50: 58, p75: 68, p90: 80 },
                sitAndReach: { p10: 20, p25: 28, p50: 36, p75: 44, p90: 54 },
                plankTest: { p10: 100, p25: 130, p50: 165, p75: 220, p90: 280 },
                tTest: { p10: 12.6, p25: 11.6, p50: 10.6, p75: 9.8, p90: 8.8 },
                reactionTime: { p10: 0.55, p25: 0.45, p50: 0.37, p75: 0.30, p90: 0.23 },
                responseTime: { p10: 1.00, p25: 0.81, p50: 0.65, p75: 0.48, p90: 0.38 },
                sprint40m: { p10: 6.6, p25: 6.0, p50: 5.5, p75: 5.0, p90: 4.5 },
            }
        },
        Female: {
            '10': {
                height: { p10: 128, p25: 133, p50: 139, p75: 146, p90: 152 },
                weight: { p10: 24, p25: 29, p50: 34, p75: 44, p90: 54 },
                bmi: { p10: 14.5, p25: 16.5, p50: 18.0, p75: 20.5, p90: 22.5 },
                shoulderGirth: { p10: 27, p25: 29, p50: 31, p75: 33, p90: 35 },
                hipCircumference: { p10: 64, p25: 68, p50: 72, p75: 80, p90: 88 },
                waistCircumference: { p10: 78, p25: 70, p50: 62, p75: 58, p90: 54 },
                skinfold: { p10: 28, p25: 22, p50: 16, p75: 12, p90: 8 },
                hipToToe: { p10: 62, p25: 66, p50: 70, p75: 75, p90: 80 },
                verticalJump: { p10: 12, p25: 18, p50: 24, p75: 30, p90: 36 },
                sitAndReach: { p10: 15, p25: 22, p50: 28, p75: 35, p90: 42 },
                plankTest: { p10: 25, p25: 40, p50: 55, p75: 75, p90: 100 },
                tTest: { p10: 17.5, p25: 16.2, p50: 15.0, p75: 13.8, p90: 12.5 },
                reactionTime: { p10: 0.90, p25: 0.75, p50: 0.60, p75: 0.50, p90: 0.40 },
                responseTime: { p10: 1.40, p25: 1.20, p50: 0.95, p75: 0.75, p90: 0.60 },
                sprint40m: { p10: 9.8, p25: 9.0, p50: 8.2, p75: 7.5, p90: 6.8 },
            },
            '11': {
                height: { p10: 134, p25: 140, p50: 146, p75: 153, p90: 160 },
                weight: { p10: 28, p25: 33, p50: 38, p75: 48, p90: 58 },
                bmi: { p10: 14.0, p25: 16.0, p50: 17.5, p75: 21.0, p90: 23.0 },
                shoulderGirth: { p10: 28, p25: 30, p50: 32, p75: 34, p90: 36 },
                hipCircumference: { p10: 68, p25: 72, p50: 76, p75: 84, p90: 92 },
                waistCircumference: { p10: 80, p25: 72, p50: 64, p75: 60, p90: 56 },
                skinfold: { p10: 28, p25: 22, p50: 16, p75: 12, p90: 8 },
                hipToToe: { p10: 66, p25: 70, p50: 74, p75: 80, p90: 86 },
                verticalJump: { p10: 14, p25: 20, p50: 26, p75: 32, p90: 38 },
                sitAndReach: { p10: 16, p25: 22, p50: 28, p75: 34, p90: 40 },
                plankTest: { p10: 35, p25: 50, p50: 70, p75: 95, p90: 120 },
                tTest: { p10: 16.5, p25: 15.2, p50: 14.2, p75: 13.0, p90: 11.8 },
                reactionTime: { p10: 0.85, p25: 0.71, p50: 0.57, p75: 0.47, p90: 0.38 },
                responseTime: { p10: 1.35, p25: 1.15, p50: 0.92, p75: 0.72, p90: 0.58 },
                sprint40m: { p10: 9.4, p25: 8.6, p50: 7.8, p75: 7.2, p90: 6.5 },
            },
            '12': {
                height: { p10: 140, p25: 146, p50: 152, p75: 158, p90: 165 },
                weight: { p10: 32, p25: 38, p50: 45, p75: 55, p90: 68 },
                bmi: { p10: 15.5, p25: 17.5, p50: 19.0, p75: 21.5, p90: 23.5 },
                shoulderGirth: { p10: 29, p25: 31, p50: 33, p75: 35, p90: 37 },
                hipCircumference: { p10: 72, p25: 78, p50: 84, p75: 92, p90: 100 },
                waistCircumference: { p10: 82, p25: 74, p50: 66, p75: 62, p90: 58 },
                skinfold: { p10: 28, p25: 22, p50: 16, p75: 12, p90: 8 },
                hipToToe: { p10: 72, p25: 76, p50: 80, p75: 86, p90: 92 },
                verticalJump: { p10: 18, p25: 23, p50: 28, p75: 34, p90: 42 },
                sitAndReach: { p10: 18, p25: 24, p50: 30, p75: 36, p90: 44 },
                plankTest: { p10: 45, p25: 60, p50: 85, p75: 115, p90: 145 },
                tTest: { p10: 15.8, p25: 14.8, p50: 13.8, p75: 12.8, p90: 11.5 },
                reactionTime: { p10: 0.81, p25: 0.68, p50: 0.54, p75: 0.45, p90: 0.36 },
                responseTime: { p10: 1.30, p25: 1.10, p50: 0.89, p75: 0.69, p90: 0.56 },
                sprint40m: { p10: 8.8, p25: 8.0, p50: 7.4, p75: 6.8, p90: 6.0 },
            },
            '13': {
                height: { p10: 145, p25: 152, p50: 158, p75: 164, p90: 172 },
                weight: { p10: 36, p25: 42, p50: 50, p75: 62, p90: 75 },
                bmi: { p10: 16.0, p25: 18.0, p50: 19.5, p75: 22.0, p90: 24.0 },
                shoulderGirth: { p10: 31, p25: 33, p50: 35, p75: 37, p90: 39 },
                hipCircumference: { p10: 78, p25: 84, p50: 90, p75: 98, p90: 106 },
                waistCircumference: { p10: 86, p25: 76, p50: 68, p75: 64, p90: 60 },
                skinfold: { p10: 28, p25: 22, p50: 16, p75: 12, p90: 8 },
                hipToToe: { p10: 76, p25: 82, p50: 88, p75: 94, p90: 100 },
                verticalJump: { p10: 20, p25: 25, p50: 30, p75: 36, p90: 44 },
                sitAndReach: { p10: 20, p25: 27, p50: 35, p75: 42, p90: 50 },
                plankTest: { p10: 55, p25: 75, p50: 100, p75: 135, p90: 175 },
                tTest: { p10: 15.2, p25: 14.2, p50: 13.2, p75: 12.2, p90: 11.2 },
                reactionTime: { p10: 0.77, p25: 0.64, p50: 0.51, p75: 0.42, p90: 0.34 },
                responseTime: { p10: 1.25, p25: 1.05, p50: 0.86, p75: 0.66, p90: 0.54 },
                sprint40m: { p10: 8.4, p25: 7.6, p50: 7.0, p75: 6.4, p90: 5.8 },
            },
            '14': {
                height: { p10: 152, p25: 157, p50: 162, p75: 168, p90: 174 },
                weight: { p10: 38, p25: 45, p50: 55, p75: 68, p90: 82 },
                bmi: { p10: 16.0, p25: 18.0, p50: 20.0, p75: 22.5, p90: 24.5 },
                shoulderGirth: { p10: 32, p25: 34, p50: 36, p75: 38, p90: 40 },
                hipCircumference: { p10: 82, p25: 88, p50: 94, p75: 102, p90: 112 },
                waistCircumference: { p10: 92, p25: 80, p50: 71, p75: 66, p90: 62 },
                skinfold: { p10: 30, p25: 25, p50: 19, p75: 15, p90: 10 },
                hipToToe: { p10: 80, p25: 86, p50: 92, p75: 100, p90: 108 },
                verticalJump: { p10: 22, p25: 28, p50: 34, p75: 40, p90: 50 },
                sitAndReach: { p10: 22, p25: 30, p50: 38, p75: 45, p90: 55 },
                plankTest: { p10: 60, p25: 85, p50: 115, p75: 155, p90: 195 },
                tTest: { p10: 14.8, p25: 13.8, p50: 12.8, p75: 11.8, p90: 10.8 },
                reactionTime: { p10: 0.73, p25: 0.60, p50: 0.48, p75: 0.40, p90: 0.32 },
                responseTime: { p10: 1.20, p25: 1.00, p50: 0.83, p75: 0.63, p90: 0.52 },
                sprint40m: { p10: 8.2, p25: 7.6, p50: 7.0, p75: 6.5, p90: 5.8 },
            },
            '15': {
                height: { p10: 153, p25: 158, p50: 163, p75: 169, p90: 176 },
                weight: { p10: 42, p25: 48, p50: 58, p75: 72, p90: 86 },
                bmi: { p10: 16.5, p25: 18.5, p50: 20.5, p75: 23.0, p90: 25.0 },
                shoulderGirth: { p10: 33, p25: 35, p50: 37, p75: 40, p90: 42 },
                hipCircumference: { p10: 84, p25: 90, p50: 96, p75: 106, p90: 116 },
                waistCircumference: { p10: 95, p25: 82, p50: 73, p75: 68, p90: 64 },
                skinfold: { p10: 32, p25: 26, p50: 20, p75: 15, p90: 10 },
                hipToToe: { p10: 82, p25: 88, p50: 94, p75: 102, p90: 110 },
                verticalJump: { p10: 24, p25: 30, p50: 36, p75: 44, p90: 52 },
                sitAndReach: { p10: 24, p25: 32, p50: 40, p75: 48, p90: 58 },
                plankTest: { p10: 65, p25: 95, p50: 125, p75: 170, p90: 215 },
                tTest: { p10: 14.2, p25: 13.2, p50: 12.2, p75: 11.4, p90: 10.4 },
                reactionTime: { p10: 0.69, p25: 0.56, p50: 0.45, p75: 0.38, p90: 0.30 },
                responseTime: { p10: 1.15, p25: 0.95, p50: 0.79, p75: 0.60, p90: 0.50 },
                sprint40m: { p10: 8.0, p25: 7.4, p50: 6.8, p75: 6.2, p90: 5.5 },
            },
            '16': {
                height: { p10: 154, p25: 159, p50: 164, p75: 170, p90: 178 },
                weight: { p10: 44, p25: 50, p50: 60, p75: 75, p90: 90 },
                bmi: { p10: 17.0, p25: 19.0, p50: 21.0, p75: 23.5, p90: 25.5 },
                shoulderGirth: { p10: 34, p25: 36, p50: 38, p75: 41, p90: 43 },
                hipCircumference: { p10: 86, p25: 92, p50: 98, p75: 108, p90: 118 },
                waistCircumference: { p10: 98, p25: 85, p50: 75, p75: 70, p90: 65 },
                skinfold: { p10: 34, p25: 28, p50: 22, p75: 16, p90: 10 },
                hipToToe: { p10: 84, p25: 90, p50: 96, p75: 104, p90: 112 },
                sitAndReach: { p10: 26, p25: 34, p50: 42, p75: 50, p90: 60 },
                verticalJump: { p10: 26, p25: 32, p50: 38, p75: 46, p90: 55 },
                plankTest: { p10: 70, p25: 100, p50: 135, p75: 185, p90: 235 },
                tTest: { p10: 13.8, p25: 12.8, p50: 11.8, p75: 11.0, p90: 10.0 },
                reactionTime: { p10: 0.65, p25: 0.52, p50: 0.42, p75: 0.35, p90: 0.28 },
                responseTime: { p10: 1.10, p25: 0.90, p50: 0.75, p75: 0.56, p90: 0.46 },
                sprint40m: { p10: 7.8, p25: 7.2, p50: 6.6, p75: 6.0, p90: 5.4 },
            }
        }
    }
};

// Internal list of all supported sports
// Internal list of all supported sports
const sportsList = [
    'Soccer', 'Cricket', 'Tennis', 'Swimming', 'Track & Field', 'Gymnastics', 'Volleyball', 'Cycling', 'Rowing',
    'Swimming - Sprint (50m/100m)', 'Swimming - Distance (400m/1500m)',
    'Track & Field - Sprint (100m/200m)', 'Track & Field - Middle Distance (800m/1500m)', 'Track & Field - Long Distance (5K/10K)',
    'Track & Field - Jumps (High/Long/Triple)', 'Track & Field - Throws (Shot/Discus/Javelin)'
];

/**
 * Sport-specific elite profiles.
 * Multipliers are relative to Basketball baseline norms.
 * For INVERSE metrics (lower = better: sprint, tTest, reactionTime, responseTime):
 *   mult < 1 = faster/better elite standard for that sport
 *   mult > 1 = slower/less critical for that sport
 */
type SportProfile = {
    heightRange: [number, number]; // [p50_base, p90_base] for age-14 Male
    weightRange: [number, number]; // [p50_base, p90_base] for age-14 Male
    verticalJumpMult: number;
    sprintMult: number;
    tTestMult: number;
    reactionTimeMult: number;
    plankTestMult: number;
    sitAndReachMult: number;
};

const sportProfiles: Record<string, SportProfile> = {
    //                         height      weight      vjump  sprint  tTest  react  plank  stretch
    'Soccer': { heightRange: [165, 175], weightRange: [55, 70], verticalJumpMult: 0.88, sprintMult: 0.94, tTestMult: 0.95, reactionTimeMult: 1.03, plankTestMult: 0.93, sitAndReachMult: 0.91 },
    'Track & Field': { heightRange: [164, 175], weightRange: [52, 66], verticalJumpMult: 1.02, sprintMult: 0.91, tTestMult: 1.03, reactionTimeMult: 0.95, plankTestMult: 0.84, sitAndReachMult: 0.96 },
    'Swimming': { heightRange: [170, 182], weightRange: [60, 76], verticalJumpMult: 0.72, sprintMult: 1.15, tTestMult: 1.10, reactionTimeMult: 1.11, plankTestMult: 1.12, sitAndReachMult: 1.09 },
    'Gymnastics': { heightRange: [148, 158], weightRange: [38, 52], verticalJumpMult: 1.03, sprintMult: 1.08, tTestMult: 1.02, reactionTimeMult: 1.04, plankTestMult: 1.30, sitAndReachMult: 1.41 },
    'Cricket': { heightRange: [166, 178], weightRange: [58, 74], verticalJumpMult: 0.78, sprintMult: 1.04, tTestMult: 1.04, reactionTimeMult: 0.88, plankTestMult: 0.88, sitAndReachMult: 0.87 },
    'Tennis': { heightRange: [168, 180], weightRange: [58, 72], verticalJumpMult: 0.86, sprintMult: 1.02, tTestMult: 0.93, reactionTimeMult: 0.96, plankTestMult: 0.93, sitAndReachMult: 0.98 },
    'Volleyball': { heightRange: [175, 188], weightRange: [66, 82], verticalJumpMult: 1.10, sprintMult: 1.04, tTestMult: 1.02, reactionTimeMult: 0.96, plankTestMult: 0.93, sitAndReachMult: 0.96 },
    'Cycling': { heightRange: [162, 174], weightRange: [50, 64], verticalJumpMult: 0.70, sprintMult: 1.15, tTestMult: 1.10, reactionTimeMult: 1.11, plankTestMult: 1.21, sitAndReachMult: 0.91 },
    'Rowing': { heightRange: [172, 186], weightRange: [70, 88], verticalJumpMult: 0.81, sprintMult: 1.15, tTestMult: 1.10, reactionTimeMult: 1.18, plankTestMult: 1.40, sitAndReachMult: 1.04 },

    // Sub-events
    'Swimming - Sprint (50m/100m)': { heightRange: [172, 184], weightRange: [62, 78], verticalJumpMult: 0.85, sprintMult: 1.05, tTestMult: 1.05, reactionTimeMult: 0.95, plankTestMult: 1.15, sitAndReachMult: 1.05 },
    'Swimming - Distance (400m/1500m)': { heightRange: [168, 180], weightRange: [58, 74], verticalJumpMult: 0.65, sprintMult: 1.20, tTestMult: 1.15, reactionTimeMult: 1.15, plankTestMult: 1.25, sitAndReachMult: 1.10 },
    'Track & Field - Sprint (100m/200m)': { heightRange: [165, 178], weightRange: [55, 70], verticalJumpMult: 1.15, sprintMult: 0.85, tTestMult: 1.00, reactionTimeMult: 0.90, plankTestMult: 0.90, sitAndReachMult: 0.90 },
    'Track & Field - Middle Distance (800m/1500m)': { heightRange: [162, 174], weightRange: [50, 64], verticalJumpMult: 0.85, sprintMult: 0.95, tTestMult: 1.05, reactionTimeMult: 1.05, plankTestMult: 1.10, sitAndReachMult: 0.95 },
    'Track & Field - Long Distance (5K/10K)': { heightRange: [158, 170], weightRange: [45, 58], verticalJumpMult: 0.70, sprintMult: 1.05, tTestMult: 1.10, reactionTimeMult: 1.15, plankTestMult: 1.35, sitAndReachMult: 1.00 },
    'Track & Field - Jumps (High/Long/Triple)': { heightRange: [170, 182], weightRange: [58, 74], verticalJumpMult: 1.30, sprintMult: 0.92, tTestMult: 0.95, reactionTimeMult: 0.95, plankTestMult: 1.00, sitAndReachMult: 1.10 },
    'Track & Field - Throws (Shot/Discus/Javelin)': { heightRange: [175, 188], weightRange: [75, 95], verticalJumpMult: 1.05, sprintMult: 1.10, tTestMult: 1.15, reactionTimeMult: 1.05, plankTestMult: 0.95, sitAndReachMult: 0.95 },
};

/**
 * Initialize all sports with fully sport-specific elite norms.
 * Each sport gets unique values for all performance metrics
 * so the radar chart reflects genuine physiological differences.
 */
const initializeAllSports = () => {
    sportsList.forEach(sport => {
        if (!normativeData[sport]) {
            normativeData[sport] = JSON.parse(JSON.stringify(normativeData.Basketball));
        }
    });

    sportsList.forEach(sport => {
        const profile = sportProfiles[sport];
        if (!profile) return;

        (['Male', 'Female'] as const).forEach(g => {
            // Female athletes scale down ~8-10% on raw measurements
            const gFactor = g === 'Female' ? 0.91 : 1.0;

            for (let age = 10; age <= 16; age++) {
                const a = age.toString();
                // Profile targets (height/weight) are for Age 14. 
                // We scale them down using the 2.5% per year growth factor relative to 14.
                const growFrom14 = 1 + (age - 14) * 0.025;
                const base = normativeData.Basketball[g][a];

                // --- Height ---
                const p50Height = profile.heightRange[0] * growFrom14 * gFactor;
                const p90Height = profile.heightRange[1] * growFrom14 * gFactor;
                normativeData[sport][g][a].height = {
                    p10: Math.round(p50Height * 0.96),
                    p25: Math.round(p50Height * 0.98),
                    p50: Math.round(p50Height),
                    p75: Math.round(p90Height * 0.98),
                    p90: Math.round(p90Height),
                } as NormativeBreakpoints;

                // --- Weight ---
                const p50Weight = profile.weightRange[0] * growFrom14 * gFactor;
                const p90Weight = profile.weightRange[1] * growFrom14 * gFactor;
                normativeData[sport][g][a].weight = {
                    p10: Math.round(p50Weight * 0.85),
                    p25: Math.round(p50Weight * 0.95),
                    p50: Math.round(p50Weight),
                    p75: Math.round(p90Weight * 0.95),
                    p90: Math.round(p90Weight),
                } as NormativeBreakpoints;

                // --- BMI ---
                const hM = (profile.heightRange[0] * growFrom14 * gFactor) / 100;
                const baseBmi = profile.weightRange[0] * growFrom14 * gFactor / (hM * hM);

                // For sports where leanness is better (run, swim), BMI should have "Best" at lower end
                const enduranceSports = ['distance', 'rowing', 'cycling', 'marathon', 'cross country', 'swimming'];
                const isLeanSport = enduranceSports.some(term => sport.toLowerCase().includes(term));

                if (isLeanSport) {
                    normativeData[sport][g][a].bmi = {
                        p10: parseFloat((baseBmi * 1.15).toFixed(1)), // 10th percentile is HIGHEST bmi (bad)
                        p25: parseFloat((baseBmi * 1.08).toFixed(1)),
                        p50: parseFloat(baseBmi.toFixed(1)),
                        p75: parseFloat((baseBmi * 0.94).toFixed(1)),
                        p90: parseFloat((baseBmi * 0.85).toFixed(1)), // 90th percentile is LOWEST bmi (elite/lean)
                    } as NormativeBreakpoints;
                } else {
                    // HIGH→LOW: p10=heaviest (worst for athlete), p90=leanest (best/elite)
                    // This matches INVERSE_METRICS engine convention (lower BMI = better)
                    normativeData[sport][g][a].bmi = {
                        p10: parseFloat((baseBmi * 1.20).toFixed(1)),  // heaviest = 10th percentile
                        p25: parseFloat((baseBmi * 1.10).toFixed(1)),
                        p50: parseFloat(baseBmi.toFixed(1)),
                        p75: parseFloat((baseBmi * 0.93).toFixed(1)),
                        p90: parseFloat((baseBmi * 0.85).toFixed(1)),  // leanest = 90th percentile (elite)
                    } as NormativeBreakpoints;
                }

                // --- Vertical Jump (higher = better) ---
                normativeData[sport][g][a].verticalJump = {
                    p10: Math.round(base.verticalJump.p10 * profile.verticalJumpMult),
                    p25: Math.round(base.verticalJump.p25 * profile.verticalJumpMult),
                    p50: Math.round(base.verticalJump.p50 * profile.verticalJumpMult),
                    p75: Math.round(base.verticalJump.p75 * profile.verticalJumpMult),
                    p90: Math.round(base.verticalJump.p90 * profile.verticalJumpMult),
                } as NormativeBreakpoints;

                // --- 40m Sprint (INVERSE: lower = faster/better) ---
                normativeData[sport][g][a].sprint40m = {
                    p10: parseFloat((base.sprint40m.p10 * profile.sprintMult).toFixed(2)),
                    p25: parseFloat((base.sprint40m.p25 * profile.sprintMult).toFixed(2)),
                    p50: parseFloat((base.sprint40m.p50 * profile.sprintMult).toFixed(2)),
                    p75: parseFloat((base.sprint40m.p75 * profile.sprintMult).toFixed(2)),
                    p90: parseFloat((base.sprint40m.p90 * profile.sprintMult).toFixed(2)),
                } as NormativeBreakpoints;

                // --- T-Test Agility (INVERSE: lower = more agile/better) ---
                normativeData[sport][g][a].tTest = {
                    p10: parseFloat((base.tTest.p10 * profile.tTestMult).toFixed(2)),
                    p25: parseFloat((base.tTest.p25 * profile.tTestMult).toFixed(2)),
                    p50: parseFloat((base.tTest.p50 * profile.tTestMult).toFixed(2)),
                    p75: parseFloat((base.tTest.p75 * profile.tTestMult).toFixed(2)),
                    p90: parseFloat((base.tTest.p90 * profile.tTestMult).toFixed(2)),
                } as NormativeBreakpoints;

                // --- Reaction Time (INVERSE: lower = faster reflexes/better) ---
                normativeData[sport][g][a].reactionTime = {
                    p10: parseFloat((base.reactionTime.p10 * profile.reactionTimeMult).toFixed(3)),
                    p25: parseFloat((base.reactionTime.p25 * profile.reactionTimeMult).toFixed(3)),
                    p50: parseFloat((base.reactionTime.p50 * profile.reactionTimeMult).toFixed(3)),
                    p75: parseFloat((base.reactionTime.p75 * profile.reactionTimeMult).toFixed(3)),
                    p90: parseFloat((base.reactionTime.p90 * profile.reactionTimeMult).toFixed(3)),
                } as NormativeBreakpoints;

                // --- Response Time (INVERSE: lower = better, same profile as reaction) ---
                normativeData[sport][g][a].responseTime = {
                    p10: parseFloat((base.responseTime.p10 * profile.reactionTimeMult).toFixed(3)),
                    p25: parseFloat((base.responseTime.p25 * profile.reactionTimeMult).toFixed(3)),
                    p50: parseFloat((base.responseTime.p50 * profile.reactionTimeMult).toFixed(3)),
                    p75: parseFloat((base.responseTime.p75 * profile.reactionTimeMult).toFixed(3)),
                    p90: parseFloat((base.responseTime.p90 * profile.reactionTimeMult).toFixed(3)),
                } as NormativeBreakpoints;

                // --- Plank Test / Core Endurance (higher = better) ---
                normativeData[sport][g][a].plankTest = {
                    p10: Math.round(base.plankTest.p10 * profile.plankTestMult),
                    p25: Math.round(base.plankTest.p25 * profile.plankTestMult),
                    p50: Math.round(base.plankTest.p50 * profile.plankTestMult),
                    p75: Math.round(base.plankTest.p75 * profile.plankTestMult),
                    p90: Math.round(base.plankTest.p90 * profile.plankTestMult),
                } as NormativeBreakpoints;

                // --- Sit & Reach / Flexibility (higher = better) ---
                normativeData[sport][g][a].sitAndReach = {
                    p10: Math.round(base.sitAndReach.p10 * profile.sitAndReachMult),
                    p25: Math.round(base.sitAndReach.p25 * profile.sitAndReachMult),
                    p50: Math.round(base.sitAndReach.p50 * profile.sitAndReachMult),
                    p75: Math.round(base.sitAndReach.p75 * profile.sitAndReachMult),
                    p90: Math.round(base.sitAndReach.p90 * profile.sitAndReachMult),
                } as NormativeBreakpoints;

                // --- Body composition metrics (inherited from Basketball base) ---
                normativeData[sport][g][a].shoulderGirth = JSON.parse(JSON.stringify(base.shoulderGirth));
                normativeData[sport][g][a].hipCircumference = JSON.parse(JSON.stringify(base.hipCircumference));
                normativeData[sport][g][a].waistCircumference = JSON.parse(JSON.stringify(base.waistCircumference));
                normativeData[sport][g][a].hipToToe = JSON.parse(JSON.stringify(base.hipToToe));
                normativeData[sport][g][a].skinfold = JSON.parse(JSON.stringify(base.skinfold));
            }
        });
    });
};

initializeAllSports();



