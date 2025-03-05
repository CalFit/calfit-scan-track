
import { useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Trophy, Star } from 'lucide-react';

// Données fictives pour cette démo
const mockFriends = [
  { id: 1, name: "Marie L.", score: 98, streak: 7, avatar: "👩‍🦰" },
  { id: 2, name: "Thomas R.", score: 85, streak: 12, avatar: "👨‍🦱" },
  { id: 3, name: "Julie S.", score: 82, streak: 5, avatar: "👱‍♀️" },
  { id: 4, name: "Maxime P.", score: 76, streak: 3, avatar: "👨" },
  { id: 5, name: "Sophie B.", score: 70, streak: 9, avatar: "👩" },
  { id: 6, name: "Vous", score: 65, streak: 4, avatar: "😊", isCurrentUser: true }
];

const LeaderboardPage = () => {
  const [friends] = useState(mockFriends);

  return (
    <MainLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold mb-2">Classement</h1>
          <p className="text-muted-foreground">
            Comparez vos progrès avec vos amis
          </p>
        </header>

        <div className="calfit-card">
          <div className="bg-calfit-blue/20 p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center">
              <Trophy className="text-calfit-blue w-5 h-5 mr-2" />
              <h3 className="text-lg font-semibold">Classement hebdomadaire</h3>
            </div>
          </div>
          
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {friends
              .sort((a, b) => b.score - a.score)
              .map((friend, index) => (
                <li 
                  key={friend.id}
                  className={`p-4 flex items-center ${friend.isCurrentUser ? 'bg-calfit-green/10' : ''}`}
                >
                  <div className="flex items-center justify-center w-8 mr-3">
                    <span className="font-semibold text-lg">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                    </span>
                  </div>
                  
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-3 text-xl">
                    {friend.avatar}
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-medium">
                      {friend.name}
                      {friend.isCurrentUser && " (Vous)"}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center">
                      <Star className="h-3 w-3 mr-1 text-calfit-orange" />
                      Série de {friend.streak} jours
                    </div>
                  </div>
                  
                  <div className="font-semibold">
                    {friend.score}
                    <span className="text-xs font-normal ml-1">pts</span>
                  </div>
                </li>
              ))}
          </ul>
        </div>

        <div className="text-center mt-4">
          <button className="calfit-button-secondary">
            Inviter des amis
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default LeaderboardPage;
