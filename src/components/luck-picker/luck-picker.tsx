import {useEffect, useMemo, useRef, useState} from 'react';
import {Button} from 'tdesign-react';
import './luck-picker.less';

const LuckPicker = props => {
  const { config, candidates, onResultChange } = props;
  const { round: totalRound, pick: pickString, speed, keepOrder } = config;

  const pickNumberByRound = String(pickString).split(pickString.includes(',') ? ',' : ' ').map(item => Number(item)); // 形态如 [5, 3, 1]，表示各轮抽取各数
  const [currentIndex, setCurrentIndex] = useState(0);
  const [picking, setPicking] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [currentList, setCurrentList] = useState(candidates); // 当前轮的总列表
  const [currentPickList, setCurrentPickList] = useState<string[]>([]); // 当前轮已经选择的列表
  const [pickResult, setPickResult] = useState<string[]>([]);
  const [finish, setFinish] = useState(false);

  const pickTimer = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const winnerAudioRef = useRef<HTMLAudioElement | null>(null);

  /**
   * 打乱数组顺序
   * @param array
   */
  const shuffleArray = (array: any[]) => {
    let curIndex = array.length, temporaryValue, randomIndex;

    // 当还剩有元素未洗牌时
    while (0 !==  curIndex) {

      // 选取剩下的元素…
      randomIndex = Math.floor(Math.random() *  curIndex);
       curIndex -= 1;

      // 并与当前元素交换
      temporaryValue = array[ curIndex];
      array[ curIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  useEffect(() => {
    audioRef.current = new Audio('/bgm.mp3')
    winnerAudioRef.current = new Audio('/winner.mp3');
  }, []);

  useEffect(() => {
    if (!config.playSound) {
      audioRef.current?.pause();
      winnerAudioRef.current?.pause();
    }
  }, [config.playSound]);

  useEffect(() => {
    setCurrentList(candidates);
  }, [candidates]);

  const handlePickStart = () => {
    config.playSound && audioRef.current?.play();
    let len;
    if (currentPickList.length === pickNumberByRound[currentRound]) {
      setCurrentRound(currentRound + 1);
      setCurrentList(currentPickList);
      setCurrentPickList([]);
      setCurrentIndex(0);
      len = currentPickList.length; // 注意状态的异步，刚切换轮数时，待优化写法
    } else {
      len = currentCandidateList.length; // 注意状态的异步，刚切换轮数时，
    }
    setPicking(true);
    pickTimer.current = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % len);
    }, speed);
  }

  const handlePickStop = () => {
    audioRef.current?.pause();
    setPicking(false);
    clearInterval(pickTimer.current);
    console.log(currentIndex, 'index');
    setPickResult([...pickResult, currentCandidateList[currentIndex]]);
    setCurrentPickList(prevCurrentPickList => {
      return [...prevCurrentPickList, currentCandidateList[currentIndex]];
    });
  };

  const currentCandidateList = useMemo(() => {
    const list = currentList.filter(item => !currentPickList.includes(item));
    return keepOrder ? list : shuffleArray(list);
  }, [currentList, currentPickList, keepOrder]);

  const calcShowName = () => {
    // 如果正在轮动
    if (picking) {
      return currentCandidateList[currentIndex];
    } else {
      return currentPickList.length ? currentPickList[currentPickList.length - 1] : currentCandidateList[0];
    }
  };

  useEffect(() => {
    if (currentRound === totalRound - 1 && currentPickList.length === pickNumberByRound[currentRound]) {
      config.playSound && winnerAudioRef.current?.play();
      setFinish(true);
    }
  }, [currentRound, currentPickList, totalRound, pickNumberByRound]);

  const resetPicker = () => {
    setCurrentList(candidates);
    setCurrentIndex(0);
    setCurrentRound(0);
    setCurrentPickList([]);
    setFinish(false);
    setPickResult([]);
  };

  useEffect(() => {
    onResultChange(pickResult);
  }, [pickResult]);

  /**
   * 计算最终中奖用户用于展示
   */
  const calcFinalResult = () => {
    const count = pickNumberByRound[pickNumberByRound.length - 1];
    return pickResult.slice(-count).join(', ');
  }

  if (finish) {
    return (<div className="luck-picker-container">
      <div className="luck-picker-finish">本次抽签结束</div>
      <div className="luck-picker-winner">恭喜幸运儿：{calcFinalResult()}</div>
      <div className="luck-picker-button">
        <Button size="large" onClick={() => resetPicker()}>再来一次</Button>
      </div>
    </div>)
  }

  return (
    <div className="luck-picker-container">
      <div className="luck-picker-status">
        <span>共 {totalRound} 轮，当前为第 {currentRound + 1} 轮，晋级 {pickNumberByRound[currentRound]} 人，已选 {currentPickList.length} 人</span>
      </div>
      <div className="luck-picker-name">
        {calcShowName()}
      </div>
      <div className="luck-picker-button">
        {
          picking ?
            (<Button size="large" onClick={handlePickStop}>停止</Button>) :
            (<Button size="large" disabled={finish || candidates.length === 0} onClick={handlePickStart}>开始</Button>)
        }
      </div>
    </div>
  );
};

export default LuckPicker;