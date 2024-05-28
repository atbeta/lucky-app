import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import './App.less';
import AppHeader from './components/app-header';
import CandidateManagement from './components/candidate-management';
import LuckPicker from './components/luck-picker';
import LotteryResult from './components/lottery-result';

export interface ILotteryConfig {
  mode: string;
  round: number;
  pick: string;
  speed: number;
  keepOrder: boolean;
  playSound?: boolean;
}

function App () {
  const [candidates, setCandidates] = useState<string[]>([]);
  const [fullCandidates, setFullCandidates] = useState<string[]>([]);
  const [lotteryConfig, setLotteryConfig] = useState<ILotteryConfig>({
    mode: 'knockout',
    round: 3,
    pick: '5,3,1',
    speed: 100,
    keepOrder: true,
    playSound: true,
  });
  const [lotteryResult, setLotteryResult] = useState<string[]>([]);

  useEffect(() => {
    invoke('read_candidates')
      .then((result) => {
        if (Array.isArray(result)) {
          setCandidates(result as string[]);
          setFullCandidates(result as string[]);
        } else {
          console.error('Unexpected result:', result);
        }
      })
      .catch((err) => {
        console.error('Failed to read candidates:', err);
      });
  }, []);

  const handleResultChange = (result: string[]) => {
    setLotteryResult(result);
  }

  return (
    <div className="container">
      <div className="lottery-config">
        <AppHeader config={lotteryConfig} setConfig={setLotteryConfig}/>
      </div>
      <div className="main-area">
        <div className="candidate-management">
          <CandidateManagement fullCandidates={fullCandidates} candidates={candidates} setCandidates={setCandidates} />
        </div>
        <div className="lottery-area">
          <LuckPicker config={lotteryConfig} candidates={candidates} onResultChange={handleResultChange}/>
        </div>
        <div className="lottery-result">
          <LotteryResult result={lotteryResult} config={lotteryConfig}/>
        </div>
      </div>
    </div>
  );
}

export default App;