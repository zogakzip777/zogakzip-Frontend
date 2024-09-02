import React from "react";
import { useParams } from "react-router-dom";
import GroupPage from "./GroupPage";
import MemoryPage from "./MemoryPage";

const CombinedPage = () => {
  const { groupId } = useParams(); // URL에서 groupId를 가져옴

  return (
    <div>
      <GroupPage groupId={groupId} />
      <MemoryPage groupId={groupId} />
    </div>
  );
};

export default CombinedPage;
