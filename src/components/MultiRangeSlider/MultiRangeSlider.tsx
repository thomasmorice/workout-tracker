import React, {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useState,
  useRef,
} from "react";

interface MultiRangeSliderProps {
  className: string;
  min: number;
  max: number;
  onMinValueChange: (value: number) => void;
  onMaxValueChange: (value: number) => void;
  defaultValueMin?: number;
  defaultValueMax?: number;
}

const MultiRangeSlider: FC<MultiRangeSliderProps> = ({
  min,
  max,
  className,
  onMinValueChange,
  onMaxValueChange,
  defaultValueMin,
  defaultValueMax,
}) => {
  const [minVal, setMinVal] = useState(defaultValueMin || min);
  const [maxVal, setMaxVal] = useState(defaultValueMax || max);
  const minValRef = useRef(defaultValueMin || min);
  const maxValRef = useRef(defaultValueMax || max);
  const range = useRef<HTMLDivElement>(null);
  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  return (
    <div className={`${className} `}>
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const value = Math.min(Number(event.target.value), maxVal - 1);
          setMinVal(value);
          onMinValueChange(value);
          minValRef.current = value;
        }}
        className="thumb thumb--left"
        style={{ zIndex: minVal > max - 100 ? "5" : "" }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const value = Math.max(Number(event.target.value), minVal + 1);
          setMaxVal(value);
          onMaxValueChange(value);
          maxValRef.current = value;
        }}
        className="thumb thumb--right"
      />

      <div className="slider">
        <div className="slider__track bg-base-300 "></div>
        <div ref={range} className="slider__range bg-base-content"></div>
        <div className="pt-3.5 text-xs font-bold">
          <div className="slider__left-value text-base-content">{minVal}mn</div>
          <div className="slider__right-value text-base-content">
            {maxVal}mn
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiRangeSlider;
