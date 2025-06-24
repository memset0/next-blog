import yaml from 'yaml';

export interface Friend {
  name: string;
  avatar: string;
  bio: string;
  link: string;
  hide: boolean;
}

export function loadFriendsFromYaml(plainYaml: string): Friend[] {
  // 解析 yaml 文本并从中提取出 Friend 数组（作为友情链接的数据）

  const data = yaml.parse(plainYaml);

  const friends: Friend[] = [];
  for (const el of data) {
    const friend: Partial<Friend> = {};
    if (el.name && typeof el.name === 'string') {
      friend.name = el.name;
    }
    if (el.avatar && typeof el.avatar === 'string') {
      friend.avatar = el.avatar;
    } else if (el.avatar_url && typeof el.avatar_url === 'string') {
      friend.avatar = el.avatar_url;
    }
    if (el.bio && typeof el.bio === 'string') {
      friend.bio = el.bio;
    }
    if (el.link && typeof el.link === 'string') {
      friend.link = el.link;
    }
    if (el.hide && typeof el.hide === 'boolean') {
      friend.hide = el.hide;
    }
    friends.push(friend);
  }

  return friends;
}
