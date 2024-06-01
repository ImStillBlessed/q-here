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

type Props = {};

const MemberTable = (props: Props) => {
  // collect the new member and append it to the list of exixting members.

  const [members, setMembers] = React.useState<Member[]>([]);

  React.useEffect(() => {
    const handleRoomUpdate = (data: Member) => {
      console.log('Received data:', data);
      setMembers((prevMembers) => [...prevMembers, data]);
    };

    socket.on('room_update', handleRoomUpdate);

    return () => {
      socket.off('room_update', handleRoomUpdate);
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

  if (activeMembers.length > 0) {
    return (
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
          <>
            {activeMembers.map((member, index) => (
              <TableRow key={member.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <UserAvatar user={member} />{' '}
                </TableCell>
                <TableCell>{member.id}</TableCell>{' '}
              </TableRow>
            ))}
          </>
        </TableBody>
      </Table>
    );
  } else {
    return <p>No membres yet</p>;
  }
};

export default MemberTable;
