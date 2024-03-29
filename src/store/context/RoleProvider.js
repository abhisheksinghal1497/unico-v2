import React, { useState, useEffect, createContext, useContext } from 'react';
import { getThById } from '../../common/functions/getTeamHierarchyByUserId';
import GetEmployeeRole from '../../common/functions/GetEmployeeRole';
import { oauth } from 'react-native-force';
import { useDispatch, useSelector } from 'react-redux';
import { getDsaBrJn, getUserInfoMaster } from '../redux/actions/masterData';

export const RoleContext = createContext({ empRole: '' });

export const RoleProvider = ({ children }) => {
  const { userInfoMasterData } = useSelector(
    (state) => state.masterData.userInfoMaster
  );
  const { dsaBrJnData } = useSelector((state) => state.masterData.dsaBrJn);
  const dispatch = useDispatch();
  console.log('userInfoMasterData', userInfoMasterData, dsaBrJnData);
  const [empRole, setEmpRole] = useState('');
  const getRole = async (userInfoMasterData) => {
    if (
      userInfoMasterData &&
      userInfoMasterData?.length > 0 &&
      userInfoMasterData[0].IsIntrnlUsr__c
    ) {
      let teamHeirarchyByUserId = await getThById();
      let role = GetEmployeeRole(teamHeirarchyByUserId);
      // setEmpRole('DSA');
      setEmpRole(role ? role : '');
      console.log('Role', dsaBrJnData, role);
      return;
    }

    if (
      userInfoMasterData &&
      userInfoMasterData?.length > 0 &&
      !userInfoMasterData[0].IsIntrnlUsr__c &&
      dsaBrJnData &&
      dsaBrJnData?.length > 0
    ) {
      let role = dsaBrJnData[0]?.Account__r?.RecordType?.Name;
      setEmpRole(role ? role : '');
      console.log('Role', dsaBrJnData);
      return;
    }
  };

  console.log('Role---->', dsaBrJnData);

  useEffect(() => {
    dispatch(getUserInfoMaster());
    dispatch(getDsaBrJn());
  }, []);
  useEffect(() => {
    // setEmpRole('RM');
    oauth.getAuthCredentials(async (cred) => {
      // console.log('cred', cred);
      await getRole(userInfoMasterData);
    });
  }, [userInfoMasterData, dsaBrJnData]);

  return (
    <RoleContext.Provider value={{ empRole }}>{children}</RoleContext.Provider>
  );
};

export const useRole = () => {
  const { empRole } = useContext(RoleContext);
  return empRole;
};
