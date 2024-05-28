import React from 'react';
import { ILotteryConfig } from '../../App.tsx';
import './lottery-result.less';

const LotteryResult = props => {
  const { result, config } = props;

  const calcResultByRound = (result: string[], config: ILotteryConfig) => {
    const { round, pick } = config;
    const pickNumberByRound = String(pick).split(pick.includes(',') ? ',' : ' ').map(item => Number(item)); // 形态如 [5, 3, 1]，表示各轮抽取各数
    const resultByRound: string[][] = [];
    let index = 0;
    for (let i = 0; i < round; i++) {
      resultByRound.push(result.slice(index, index + pickNumberByRound[i]));
      index += pickNumberByRound[i];
    }
    return resultByRound;
  }

  const resultByRound = calcResultByRound(result, config);

  return (
    <div className="lottery-result-container">
      {
        resultByRound.filter(item => item.length > 0).map((roundResult: string[], index: number) => (
          <div key={index} className="round-result" style={{ marginBottom: '.5rem' }}>
            <div className="round-title">第{index + 1}轮</div>
            <div className="round-content">
              {
                roundResult.map((item: string, idx: number) => (
                  <div key={idx}>{item}</div>
                ))
              }
            </div>
          </div>
        ))
      }
    </div>
  );
};

export default LotteryResult;