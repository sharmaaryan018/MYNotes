import React from 'react';
import NoteActions from './NoteActions';

const NoteCard = ({ note, onApprove, onReject, onDownload }) => {
  return (
    <tr className="border-b text-black">
      <td>{note.title}</td>
      <td>{note.subject}</td>
      <td>{note.uploader || 'Unknown'}</td>
      <td>{new Date(note.createdAt).toLocaleDateString()}</td>

      <td>
        <NoteActions
          onApprove={() => onApprove(note._id)}
          onView={() => window.open(note.fileUrl)}
          onDownload={() => window.location.href = note.fileUrl}
          onReject={() => onReject(note)}
        />
      </td>
    </tr>
  );
};

export default NoteCard;
