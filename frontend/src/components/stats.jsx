import React from "react";
import { FaUsers, FaClock, FaTimesCircle } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

export const Stats = ({ stats }) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="bg-blue-500 p-2 text-white rounded-lg flex items-center">
        <FaUsers className="text-3xl mr-2" />
        <div>
          <h3 className="text-lg">Total Notes</h3>
          <p>{stats.totalNotes}</p>
        </div>
      </div>
      <div className="bg-green-500 p-4 text-white rounded-lg flex items-center">
        <IoMdCheckmarkCircleOutline className="text-3xl mr-2" />
        <div>
          <h3 className="text-lg">Approved Notes</h3>
          <p>{stats.approvedNotes}</p>
        </div>
      </div>
      <div className="bg-yellow-500 p-4 text-white rounded-lg flex items-center">
        <FaClock className="text-3xl mr-2" />
        <div>
          <h3 className="text-lg">Pending Notes</h3>
          <p>{stats.pendingNotes}</p>
        </div>
      </div>
      <div className="bg-red-500 p-4 text-white rounded-lg flex items-center">
        <FaTimesCircle className="text-3xl mr-2" />
        <div>
          <h3 className="text-lg">Rejected Notes</h3>
          <p>{stats.rejectedNotes}</p>
        </div>
      </div>
    </div>
  );
};
