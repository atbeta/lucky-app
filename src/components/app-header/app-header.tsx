import { Button, Select, Switch, InputNumber, Row, Col, Input } from 'tdesign-react';
import { Icon } from 'tdesign-icons-react';
import './app-header.less';


const AppHeader = props => {
  const { config, setConfig } = props;

  const onModeChange = mode => {
    if (mode === 'normal') {
      setConfig({
        ...config,
        mode,
        round: 1,
        pick: '1',
      })
    } else {
      setConfig({
        ...config,
        mode,
        round: 3,
        pick: '5,3,1',
      })
    }
  }

  const handlePickChange = v => {
    // pick 输出值限制为以,或空格分割的数字，且要求左侧数字要大于右侧数字
    const _pick = v.replace(/[^0-9, ]/g, '');
    setConfig({
      ...config,
      pick: _pick,
    })
  }

  const handleRoundChange = v => {
    setConfig({
      ...config,
      round: v,
    })
  }

  const handleSpeedChange = v => {
    setConfig({
      ...config,
      speed: v,
    })
  }

  const handleKeepOrderChange = v => {
    setConfig({
      ...config,
      keepOrder: v,
    })
  }

  const handleSoundSwitch = v => {
    setConfig({
      ...config,
      playSound: v,
    })
  }

  return (
    <div className="app-header-container">
      <Row className="header-row">
        <Col span={2} className="header-row-item">
          <Select
            autoWidth
            value={config.mode}
            onChange={onModeChange}
            options={[
              {label: '普通模式', value: 'normal'},
              {label: '晋级模式', value: 'knockout'},
            ]}
          />
        </Col>
        {config.mode === 'normal' && <Col span={3} className="header-row-item">
          <span className="row-item-label">中签人数</span>
          <Input value={config.pick} onChange={handlePickChange} />
        </Col>}
        {config.mode === 'knockout' && <Col span={3} className="header-row-item">
          <span className="row-item-label">总轮数</span>
          <Input type="number" value={config.round.toString()} onChange={handleRoundChange} />
        </Col>}
        {config.mode === 'knockout' && <Col span={3} className="header-row-item">
          <span className="row-item-label">每轮人数</span>
          <Input value={config.pick} onChange={handlePickChange} />
        </Col>}
        <Col className="top-right-button">
          {config.playSound ?
            <Icon name="sound" size="1.5rem" onClick={() => handleSoundSwitch(false)} /> :
            <Icon name="sound-mute-1" size="1.5rem" onClick={() => handleSoundSwitch(true)} />
          }
        </Col>
      </Row>
      <Row className="header-row">
        <Col className="header-row-item">
          <span className="row-item-label">间隔(ms)</span>
          <InputNumber
            size="medium"
            theme="row"
            min={10}
            max={10000}
            defaultValue={config.speed}
            step={10}
            decimalPlaces={0}
            onChange={handleSpeedChange}
          />
        </Col>
        <Col className="header-row-item">
          <span className="row-item-label">保持顺序</span>
          <Switch value={config.keepOrder} onChange={handleKeepOrderChange}/>
        </Col>
      </Row>
    </div>
  );
};

export default AppHeader;