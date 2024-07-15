'use client';
import { Member } from '@prisma/client';
import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import UserAvatar from '../UserAvatar';
import { socket } from '@/utils/socket';

type Props = {
  allMembers: Member[];
};

const MemberTable = ({ allMembers }: Props) => {
  const [members, setMembers] = React.useState<Member[]>(allMembers);

  React.useEffect(() => {
    const handleRoomUpdate = (data: Member) => {
      console.log('Received data:', data);

      // Check if the member already exists
      setMembers((prevMembers) => {
        const memberExists = prevMembers.some(
          (member) => member.id === data.id
        );
        if (!memberExists) {
          return [...prevMembers, data];
        }
        return prevMembers.map((member) =>
          member.id === data.id ? data : member
        );
      });
    };

    socket.on('room_update', handleRoomUpdate);

    return () => {
      socket.off('room_update', handleRoomUpdate);
    };
  }, []);

  React.useEffect(() => {
    const handleMemberLeave = (data: { id: string }) => {
      console.log('Member left:', data);

      setMembers((prevMembers) =>
        prevMembers.filter((member) => member.id !== data.id)
      );
    };

    socket.on('member_leave', handleMemberLeave);

    return () => {
      socket.off('member_leave', handleMemberLeave);
    };
  }, []);

  const activeMembers = React.useMemo(() => {
    return members
      .filter((member) => member.active)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  }, [members]);

  return (
    <div>
      {activeMembers.length > 0 ? (
        <Table className="mt-4">
          <TableCaption>End of List.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[10px]">No.</TableHead>
              <TableHead></TableHead>
              <TableHead>User ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeMembers.map((member, index) => (
              <TableRow key={member.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <UserAvatar user={member} />
                </TableCell>
                <TableCell>{member.id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No members yet</p>
      )}
    </div>
  );
};

export default MemberTable;
