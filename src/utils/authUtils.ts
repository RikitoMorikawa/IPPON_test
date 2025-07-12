import Cookies from 'js-cookie';

interface TokenData {
  clientID: string;
  clientName: string;
  employeeID: string;
  role: string;
  email?: string;
  exp?: number;
  [key: string]: any;
}

/**
 * Base64 URLセーフエンコーディングをデコード（UTF-8対応）
 */
const base64UrlDecode = (str: string): string => {
  // パディングを追加
  str += '='.repeat((4 - str.length % 4) % 4);
  // URLセーフ文字を標準Base64文字に変換
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  
  // UTF-8デコードのためにTextDecoderを使用
  try {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new TextDecoder('utf-8').decode(bytes);
  } catch (error) {
    // フォールバック: 従来の方法
    return atob(base64);
  }
};

/**
 * JWTトークンをデコードする
 */
const decodeJWT = (token: string): TokenData | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid JWT format');
      return null;
    }

    const payload = parts[1];
    const decodedPayload = base64UrlDecode(payload);
    const parsedPayload = JSON.parse(decodedPayload);
    
    return parsedPayload;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

/**
 * JWTトークンの有効期限をチェック
 */
const isTokenExpired = (tokenData: TokenData): boolean => {
  if (!tokenData.exp) return false;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return tokenData.exp < currentTime;
};

/**
 * トークンを取得してデコードされたデータを返す
 */
const getTokenData = (): TokenData | null => {
  const token = Cookies.get('token');
  if (!token) {
    return null;
  }

  const tokenData = decodeJWT(token);
  if (!tokenData) {
    return null;
  }

  // トークンの有効期限をチェック
  if (isTokenExpired(tokenData)) {
    console.warn('Token has expired');
    // 期限切れの場合はCookieをクリア
    Cookies.remove('token');
    return null;
  }

  return tokenData;
};

/**
 * クライアントIDを取得
 */
export const getClientID = (): string | null => {
  const tokenData = getTokenData();
  return tokenData?.['custom:clientId'] || tokenData?.clientID || tokenData?.client_id || null;
};

/**
 * 従業員IDを取得
 */
export const getEmployeeID = (): string | null => {
  const tokenData = getTokenData();
  return tokenData?.sub || tokenData?.employeeID || tokenData?.employee_id || null;
};

/**
 * ロールを取得
 */
export const getRole = (): string | null => {
  const tokenData = getTokenData();
  return tokenData?.['custom:role'] || tokenData?.role || null;
};

/**
 * クライアント名を取得（JWTには含まれていないためAPIから取得が必要）
 */
export const getClientName = (): string | null => {
  const tokenData = getTokenData();
  return tokenData?.clientName || tokenData?.client_name || null;
};

/**
 * メールアドレスを取得
 */
export const getEmail = (): string | null => {
  const tokenData = getTokenData();
  return tokenData?.email || null;
};

/**
 * 名前を取得
 */
export const getFirstName = (): string | null => {
  const tokenData = getTokenData();
  return tokenData?.given_name || null;
};

/**
 * 姓を取得  
 */
export const getLastName = (): string | null => {
  const tokenData = getTokenData();
  return tokenData?.family_name || null;
};

/**
 * フルネームを取得
 */
export const getFullName = (): string | null => {
  const lastName = getLastName();
  const firstName = getFirstName();
  if (lastName && firstName) {
    return `${lastName} ${firstName}`;
  }
  return lastName || firstName || null;
};

/**
 * 認証状態をチェック
 */
export const isAuthenticated = (): boolean => {
  const tokenData = getTokenData();
  return tokenData !== null;
};

/**
 * すべてのトークンデータを取得（デバッグ用）
 */
export const getAllTokenData = (): TokenData | null => {
  return getTokenData();
};

/**
 * トークンをクリア
 */
export const clearToken = (): void => {
  Cookies.remove('token');
}; 