import React, { useState } from 'react';
import { List, Link, Space } from 'tdesign-react';
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
              <Link theme="primary" hover="color" onClick={() => handleExclude(candidate)}>{exclude.get(candidate) ? '加入' : '排除'}</Link>
            </Space>
          }><span className={exclude.get(candidate) ? 'deleted-item' : ''}>{candidate}</span></ListItem>
        ))
      }
    </List>
  );
};

export default CandidateManagement;