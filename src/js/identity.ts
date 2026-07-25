import {
  callAigramAPI,
  isInAigram,
  telegramId,
} from '../shared/runtime/bridge';

type TAlterUProfile = {
  name?: string;
  user_name?: string;
};

type TAlterUResponse = {
  data?: TAlterUProfile;
};

export async function resolveIdentityName() {
  const query = new URLSearchParams(window.location.search);
  const previewName = query.get('user_name')?.trim();
  if (previewName) return previewName;

  if (isInAigram && telegramId) {
    const response = await callAigramAPI<TAlterUResponse>(
      `/note/telegram/user/get/info/by/telegram_id?telegram_id=${encodeURIComponent(
        telegramId,
      )}`,
      'GET',
    );
    const name = (response.data?.name || response.data?.user_name)?.trim();
    if (!name) throw new Error('AlterU profile did not return name');

    return name;
  }

  return 'AlterU';
}
