
import React, { useEffect, useState } from 'react';
import { teachingSessionService } from '@/lib/supabase';
import { TeachingSession } from '@/lib/types';

const TodayClassesList = () => {
  const [sessions, setSessions] = useState<TeachingSession[]>([]);

  useEffect(() => {
    const loadTodaySessions = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const { data: sessionsData } = await teachingSessionService.getByDate(today);
        setSessions(sessionsData || []);
      } catch (error) {
        console.error('Error loading today sessions:', error);
      }
    };
    
    loadTodaySessions();
  }, []);

  return (
    <div className="space-y-4">
      {sessions.length === 0 ? (
        <p className="text-sm text-muted-foreground">Không có buổi học nào hôm nay</p>
      ) : (
        sessions.map(session => (
          <div key={session.id} className="flex flex-col">
            <p className="text-sm font-medium">{session.classes?.ten_lop_full}</p>
            <p className="text-xs text-muted-foreground">
              {session.thoi_gian_bat_dau?.slice(0, 5)} - {session.thoi_gian_ket_thuc?.slice(0, 5)}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default TodayClassesList;
