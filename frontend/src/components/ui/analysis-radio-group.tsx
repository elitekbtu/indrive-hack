import React from 'react';
import styled from 'styled-components';

interface AnalysisRadioGroupProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
}

const AnalysisRadioGroup: React.FC<AnalysisRadioGroupProps> = ({ selectedValue, onValueChange }) => {
  return (
    <StyledWrapper>
      <div className="glass-radio-group">
        <input 
          type="radio" 
          name="analysis" 
          id="full-analysis" 
          checked={selectedValue === 'analyze-comprehensive'}
          onChange={() => onValueChange('analyze-comprehensive')}
        />
        <label htmlFor="full-analysis">Полный анализ</label>
        
        <input 
          type="radio" 
          name="analysis" 
          id="parts-analysis"
          checked={selectedValue === 'analyze'}
          onChange={() => onValueChange('analyze')}
        />
        <label htmlFor="parts-analysis">По частям</label>
        
        <div className="glass-glider" />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .glass-radio-group {
    --bg: rgba(34, 197, 94, 0.08);
    --text: #374151;

    display: flex;
    position: relative;
    background: var(--bg);
    border-radius: 1rem;
    backdrop-filter: blur(12px);
    box-shadow:
      inset 1px 1px 4px rgba(34, 197, 94, 0.2),
      inset -1px -1px 6px rgba(0, 0, 0, 0.1),
      0 4px 12px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    width: fit-content;
    margin: 0 auto;
  }

  .glass-radio-group input {
    display: none;
  }

  .glass-radio-group label {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 200px;
    font-size: 15px;
    padding: 1rem 2.5rem;
    cursor: pointer;
    font-weight: 600;
    letter-spacing: 0.3px;
    color: var(--text);
    position: relative;
    z-index: 2;
    transition: color 0.3s ease-in-out;
    text-align: center;
    line-height: 1.2;
  }

  .glass-radio-group label:hover {
    color: #111827;
  }

  .glass-radio-group input:checked + label {
    color: #fff;
  }

  .glass-glider {
    position: absolute;
    top: 0;
    bottom: 0;
    width: calc(100% / 2);
    border-radius: 1rem;
    z-index: 1;
    transition:
      transform 0.5s cubic-bezier(0.37, 1.95, 0.66, 0.56),
      background 0.4s ease-in-out,
      box-shadow 0.4s ease-in-out;
  }

  /* Full Analysis */
  #full-analysis:checked ~ .glass-glider {
    transform: translateX(0%);
    background: linear-gradient(135deg, #22c55e, #16a34a);
    box-shadow:
      0 0 18px rgba(34, 197, 94, 0.5),
      0 0 10px rgba(134, 239, 172, 0.4) inset;
  }

  /* Parts Analysis */
  #parts-analysis:checked ~ .glass-glider {
    transform: translateX(100%);
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    box-shadow:
      0 0 18px rgba(59, 130, 246, 0.5),
      0 0 10px rgba(147, 197, 253, 0.4) inset;
  }`;

export default AnalysisRadioGroup;
