import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useRecoilState } from 'recoil';

import styled from 'styled-components';
import { compareBoxData } from '../../recoil/recoilStore';

const ListCardComp = ({ arrState, list }) => {
  const navigate = useNavigate();
  const [isArr, setIsArr] = arrState;

  const [isFill, setIsFill] = useState(false);

  useEffect(() => {
    if (list.itemName !== 'null') {
      setIsFill(true);
    } else {
      setIsFill(false);
    }
  }, [isArr]);

  const deleteList = (id) => {
    let deletedArr = isArr.map((list) =>
      list.medicineId === id
        ? { medicineId: isArr.indexOf(list) + 1, itemName: 'null' }
        : list
    );
    setIsArr(deletedArr);
  };

  const goToSearch = () => {
    navigate('/search');
  };

  return (
    <>
      {isFill ? (
        <ListCard isFill={isFill} image={list.itemImage}>
          <div className='cardImg'></div>
          <div className='cardContent'>
            <div className='listName'>{list.itemName}</div>
            <div className='listSubContent'>{list.entpName}</div>
            <div className='listSubContent'>{list.etcOtcCode}</div>
          </div>
          <div
            className='cardDeleteImg'
            onClick={() => {
              deleteList(list.medicineId);
            }}></div>
        </ListCard>
      ) : (
        <ListCard
          isFill={isFill}
          onClick={() => {
            goToSearch();
          }}>
          <div className='addListImg'></div>
          <div className='addComment'>Please Input Medication</div>
        </ListCard>
      )}
    </>
  );
};

const CompareBox = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState('close');

  const [isArr, setIsArr] = useRecoilState(compareBoxData);
  const [isArrLength, setIsArrLength] = useState(0);

  useEffect(() => {
    let count = 0;
    for (let i = 0; i < isArr.length; i++) {
      if (isArr[i].itemName !== 'null') {
        count++;
      }
    }
    setIsArrLength(count);
  }, [isArr]);

  useEffect(() => {
    if (isArrLength === 2) {
      setIsOpen('open');
    } else if (isArrLength === 0) {
      setIsOpen('close');
    }
  }, [isArrLength]);

  const boxToggle = () => {
    switch (isOpen) {
      case 'close':
        setIsOpen('open');
        break;
      case 'open':
        setIsOpen('close');
        break;
      case 'hide':
        setIsOpen('close');
        break;
    }
  };
  const closeBox = () => {
    setIsOpen('hide');
  };

  const goToCompare = () => {
    if (isArrLength === 2) {
      navigate('/compare?tab=IngGraph');

      //이동 후 state 초기화
      setIsOpen(false);
    }
  };

  const listReset = () => {
    const allDeletedArr = isArr.map((list) =>
      list.itemName !== 'null'
        ? { medicineId: isArr.indexOf(list) + 1, itemName: 'null' }
        : list
    );
    setIsArr(allDeletedArr);
  };

  return (
    <Wrap isOpen={isOpen}>
      <div className='wrap'>
        <div className='backLayout'></div>
        <div className='layout'>
          <BoxTop isOpen={isOpen} isArrLength={isArrLength}>
            <div className='boxCommentWrap'>
              <div className='boxComment'>Compare Medications</div>
              <div className='boxNum'>{isArrLength}/2</div>
            </div>
            <div className='boxButtonWrap'>
              <div className='boxButtonReset' onClick={listReset}>
                <div className='boxButtonResetImg'></div>Reset
              </div>
              <button className='goToCompareBtn' onClick={goToCompare}>
                Compare
              </button>
            </div>
            <div className='deleteBoxBtn' onClick={closeBox}></div>
          </BoxTop>
          <BoxContent>
            {isArr.map((list) => (
              <ListCardComp
                key={list.medicineId}
                list={list}
                arrState={[isArr, setIsArr]}
              />
            ))}
          </BoxContent>
        </div>
        <div className='toggleBtnBehind'></div>
        <div className='toggleBtnWrap' onClick={boxToggle}>
          <div className='toggleBtnImg'></div>
        </div>
      </div>
    </Wrap>
  );
};

const Wrap = styled.div`
  position: fixed;
  left: 0;
  bottom: ${({ isOpen }) => {
    switch (isOpen) {
      case 'open':
        return 0;
      case 'close':
        return '-222px';
      case 'hide':
        return '-322px';
    }
  }};
  transition: bottom 0.3s;
  width: 100%;
  z-index: 1000;
  background-color: white;
  .wrap {
    position: relative;
  }
  .layout {
    margin: 0 auto;
    max-width: 1050px;
    height: 100%;
  }
  .backLayout {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    box-shadow: 0 0 24px 1px rgba(0, 0, 0, 0.2);
    z-index: 2;
    background-color: white;
  }
  .boxComment {
    margin-right: 14px;
  }
  .toggleBtnBehind {
    position: absolute;
    left: 50%;
    top: -35px;
    transform: translateX(-50%);
    width: 72px;
    height: 55px;
    background-color: #ffffff;
    box-shadow: 0px 0px 30px 1px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }
  .toggleBtnWrap {
    position: absolute;
    left: 50%;
    top: -35px;
    transform: translateX(-50%);
    width: 72px;
    height: 55px;
    background-color: #ffffff;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
  }
  .toggleBtnImg {
    width: 32px;
    height: 32px;
    background-image: url('/assets/image/arrow_up.png');
    ${({ isOpen }) =>
      isOpen === 'open'
        ? `transform: rotate(180deg);`
        : `transform: rotate(0deg);`};
    background-size: cover;
    background-position: center;
    transition: transform 0.3s;
    margin-bottom: 10px;
  }
`;
const BoxTop = styled.div`
  height: 100px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 2;
  position: relative;
  .boxCommentWrap {
    font-size: 20px;
    line-height: 28px;
    font-weight: bold;
    display: flex;
  }
  .boxButtonWrap {
    display: flex;
    align-items: center;
  }
  .boxButtonReset {
    color: #f43f3f;
    font-size: 14px;
    line-height: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-right: 14px;
  }
  .boxButtonResetImg {
    width: 24px;
    height: 24px;
    background-image: url('/assets/image/icon_reset.png');
  }
  .goToCompareBtn {
    width: 170px;
    height: 40px;
    background-color: ${({ isArrLength }) =>
      isArrLength === 2 ? '#242424' : '#B7B7B7'};
    border-radius: 38px;
    border: none;
    color: white;
    cursor: ${({ isArrLength }) => (isArrLength === 2 ? 'pointer' : 'auto')};
    font-weight: bold;
  }
  .deleteBoxBtn {
    width: 40px;
    height: 40px;
    background-image: url('/assets/image/icon_delete2.png');
    background-size: cover;
    background-position: center;
    position: absolute;
    right: -100px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }
`;
const BoxContent = styled.div`
  height: 222px;
  width: 100%;
  display: flex;
  gap: 50px;
  position: relative;
  z-index: 2;
`;
const ListCard = styled.div`
  position: relative;
  width: 90%;
  height: 186px;
  border: 1px solid #d0d0d0;
  border-radius: 20px;
  padding: 48px 24px;
  display: flex;
  align-items: center;
  cursor: pointer;
  ${({ isFill }) =>
    isFill
      ? null
      : `background-color: #E7E7E7; justify-content: center; flex-direction: column;`}
  .cardImg {
    width: 160px;
    height: 100%;
    background-image: ${({ image }) =>
      image ? `url(${image})` : `url('/assets/image/NoImage.png')`};
    background-size: contain;
    background-position: center;
    margin-right: 24px;
  }
  .listName {
    font-size: 18px;
    line-height: 26px;
    font-weight: bold;
    width: 250px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 18px;
  }
  .listSubContent {
    font-size: 14px;
    line-height: 24px;
    font-weight: bold;
    color: #868686;
    width: 250px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .cardDeleteImg {
    width: 32px;
    height: 32px;
    position: absolute;
    right: 10px;
    top: 10px;
    background-image: url('/assets/image/icon_delete.png');
    background-size: cover;
    background-position: center;
    cursor: pointer;
  }
  .cardNothing {
    width: 100%;
    height: 100%;
  }
  .addListImg {
    width: 32px;
    height: 32px;
    background-image: url('/assets/image/icon_add1.png');
    background-size: cover;
    background-position: center;
    margin-bottom: 10px;
  }
  .addComment {
    font-size: 18px;
    line-height: 26px;
    color: #242424;
    font-weight: bold;
  }
`;

export default CompareBox;
