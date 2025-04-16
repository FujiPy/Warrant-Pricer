# Warrant-Pricer
BULLZ Warrant Pricer 


An interactive financial calculator for pricing Webulls warrants (BULLZ) with $10 exercise price and 30-day minimum hold period.

## Features

- **Real-time calculations**: Instantly see how changes in parameters affect warrant prices
- **Interactive UI**: Sliders and input fields for easy parameter adjustments
- **Multiple analysis views**: Basic calculation, time analysis, and sensitivity analysis
- **Visual charts**: Graphical representation of warrant pricing over time
- **Black-Scholes model**: Implements a modified Black-Scholes model with adjustments for:
  - Dilution effects
  - Minimum hold period restrictions
  - Illiquidity discounts

## How to Use

1. Visit the [calculator website](https://fujipy.github.io/Warrant-Pricer/)
2. Adjust parameters using sliders or input fields:
   - Stock price (BULL)
   - Volatility
   - Risk-free rate
   - Time to expiration
   - Dilution factor
   - Days since listing
   - Minimum hold period
   - Illiquidity discount
3. View results in real-time
4. Switch between tabs to see different analysis views

## Mathematical Model

This calculator implements a modified Black-Scholes option pricing model:

- **Basic Black-Scholes Value**: Standard calculation for European call options
- **Dilution Adjustment**: Accounts for warrant exercise diluting existing shares
- **Illiquidity Discount**: Applied during the minimum hold period
- **Probability Calculation**: Shows likelihood of warrant ending in-the-money

### Key Formulas

The Black-Scholes formula used:

```
d1 = (ln(S/K) + (r + σ²/2)T) / (σ√T)
d2 = d1 - σ√T
Call Value = S·N(d1) - K·e^(-rT)·N(d2)
```

Where:
- S = Stock price
- K = Strike price ($10)
- r = Risk-free rate
- σ = Volatility
- T = Time to expiration
- N(x) = Cumulative normal distribution function

## Development

### Prerequisites

- Basic understanding of HTML, CSS, and JavaScript
- Web browser with JavaScript enabled

### Local Development

1. Clone the repository:
```
git clone https://github.com/yourusername/webulls-warrant-calculator.git
```

2. Open index.html in your browser

3. Make changes to HTML, CSS, or JavaScript files as needed

4. Refresh browser to see changes

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Black-Scholes option pricing model
- Financial modeling principles for SPAC warrants

## Contact
