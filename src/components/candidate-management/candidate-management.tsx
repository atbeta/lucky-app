import React, { useState } from 'react';
import { List, Space, Popup  } from 'tdesign-react';
import { Icon } from 'tdesign-icons-react';
import './candidate-management.less';

const { ListItem } = List;

const CandidateManagement = props => {
  const { fullCandidates, candidates, setCandidates } = props;
  const [exclude, setExclude] =  useState<Map<string, boolean>>(new Map());

  /**
   * 排除候选人
   */
  const handleExclude = (candidate: string) => {
    // 已经排除的取消排除，未排除的排除
    const newExclude = new Map(exclude);
    if (newExclude.has(candidate)) {
      newExclude.delete(candidate);
    } else {
      newExclude.set(candidate, true);
    }
    setExclude(newExclude);
    setCandidates(fullCandidates.filter((item: string) => !newExclude.has(item)));
  };

  return (
    <List className="candidate-list">
      {
        fullCandidates.map((candidate: string, index: number) => (
          <ListItem key={index} action={
            <Space>
              {exclude.get(candidate) ?
                (<Popup trigger="hover" showArrow content="点击加入" placement="right-top">
                  <Icon size="1rem" name="user-checked" style={{ color: '#999', cursor: 'pointer' }} onClick={() => handleExclude(candidate)} />
                </Popup>) :
                (<Popup trigger="hover" showArrow content="点击排除" placement="right-top">
                  <Icon name="user-blocked" size="1rem" style={{ cursor: 'pointer' }} onClick={() => handleExclude(candidate)} />
                </Popup>)}
            </Space>
          }><span className={exclude.get(candidate) ? 'deleted-item' : ''}>{candidate}</span></ListItem>
        ))
      }
    </List>
  );
};

export default CandidateManagement;