export type SupportIssue =
  | 'missing_results'
  | 'wrong_upload'
  | 'credits_not_applied'
  | 'download_help'
  | 'export_help'
  | 'refund_request'
  | 'account_issue'
  | 'unknown';

export type SupportReply = {
  issue: SupportIssue;
  subject: string;
  body: string;
  nextAction: 'resolve' | 'escalate' | 'collect_more_info';
  ask: string[];
};

const replyMap: Record<SupportIssue, SupportReply> = {
  missing_results: {
    issue: 'missing_results',
    subject: 'Your results are still being generated',
    body: 'Thanks for reaching out. If your job is still processing, the results may not be ready yet. Please allow some time for generation, then check your results page. If it has been longer than expected, send us the email you used and the approximate time you placed the order.',
    nextAction: 'collect_more_info',
    ask: ['What email did you use?', 'Roughly when did you place the order?'],
  },
  wrong_upload: {
    issue: 'wrong_upload',
    subject: 'Uploaded the wrong photos or file',
    body: 'You can upload a new set from the same product page after the current job finishes or fails. If you were doing a preview and want to restart, just start a new preview.',
    nextAction: 'resolve',
    ask: [],
  },
  credits_not_applied: {
    issue: 'credits_not_applied',
    subject: 'Credits did not show up after payment',
    body: 'Payment-related issues sometimes need a quick check against the order. Please send the email used for the purchase and the last four digits of the card or the order confirmation you received.',
    nextAction: 'collect_more_info',
    ask: ['Which email was used?', 'Do you have an order confirmation?'],
  },
  download_help: {
    issue: 'download_help',
    subject: 'How to download your results',
    body: 'Your finished results are available on the product results page. Open the result and use the download button on that page. If the button is missing or the file will not open, tell us which result and we will take a look.',
    nextAction: 'resolve',
    ask: ['Which result is giving you trouble?'],
  },
  export_help: {
    issue: 'export_help',
    subject: 'How to export your article',
    body: 'Finished articles can be exported from the article editor. Look for the export option in the editor toolbar once the article is ready. If the export option is missing, the article may still be in preview or draft state.',
    nextAction: 'resolve',
    ask: ['Is the article marked as finished or still in draft?'],
  },
  refund_request: {
    issue: 'refund_request',
    subject: 'Refund request received',
    body: 'Thanks for letting us know. Refund requests are handled case by case because each purchase has different status. Please reply with the email used for the purchase and what went wrong, and we will review it.',
    nextAction: 'escalate',
    ask: ['Which email was used?', 'What went wrong?'],
  },
  account_issue: {
    issue: 'account_issue',
    subject: 'Account issue',
    body: 'Thanks for contacting support. Please send the email tied to your account and a short description of the issue so we can look it up quickly.',
    nextAction: 'collect_more_info',
    ask: ['What is the email on your account?', 'What is happening?'],
  },
  unknown: {
    issue: 'unknown',
    subject: 'Thanks for reaching out',
    body: 'Thanks for writing in. To help you fastest, please tell us what you were trying to do and what happened instead.',
    nextAction: 'collect_more_info',
    ask: ['What were you trying to do?', 'What happened?'],
  },
};

export function triageSupportMessage(message: string): SupportReply {
  const lower = message.toLowerCase();

  if (lower.includes('missing') || lower.includes('not ready') || lower.includes('where is') || lower.includes('results') || lower.includes('generate')) {
    return replyMap.missing_results;
  }
  if (lower.includes('wrong') || lower.includes('mistake') || lower.includes('reupload') || lower.includes('retake')) {
    return replyMap.wrong_upload;
  }
  if (lower.includes('credit') || lower.includes('charge') || lower.includes('payment') || lower.includes('applied') || lower.includes('balance')) {
    return replyMap.credits_not_applied;
  }
  if (lower.includes('download') || lower.includes('save') || lower.includes('file') || lower.includes('open')) {
    return replyMap.download_help;
  }
  if (lower.includes('export') || lower.includes('word') || lower.includes('pdf') || lower.includes('copy')) {
    return replyMap.export_help;
  }
  if (lower.includes('refund') || lower.includes('money back') || lower.includes('charged')) {
    return replyMap.refund_request;
  }
  if (lower.includes('account') || lower.includes('login') || lower.includes('password') || lower.includes('reset')) {
    return replyMap.account_issue;
  }

  return replyMap.unknown;
}
