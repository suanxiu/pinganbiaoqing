const env = require('../config/env');
const analytics = require('./analytics');

function createJob(spec) {
  const job = {
    id: 'job-' + Date.now(),
    state: 'rendering_static',
    createdAt: Date.now(),
    spec: {
      scene: spec.scene || 'general',
      styleId: spec.theme || 'peony',
      outputType: 'image'
    }
  };
  analytics.track('generation_start', { scene: job.spec.scene, styleId: job.spec.styleId, outputType: 'image' });
  return job;
}

function completeStatic(job, imagePath) {
  const result = {
    id: job.id,
    state: 'ready',
    mediaType: 'image',
    imagePath: imagePath,
    expiresAt: 0,
    degraded: false
  };
  analytics.track('generation_result', { state: result.state, outputType: result.mediaType, degraded: false });
  return result;
}

function requestMotion(job, staticResult) {
  if (!env.features.videoRendering || !env.apiBaseUrl) {
    const fallback = {
      id: job.id,
      state: 'degraded_static',
      mediaType: 'image',
      imagePath: staticResult.imagePath,
      degraded: true,
      reason: 'VIDEO_SERVICE_UNAVAILABLE'
    };
    analytics.track('generation_result', { state: fallback.state, outputType: fallback.mediaType, degraded: true });
    return Promise.resolve(fallback);
  }

  return Promise.resolve({
    id: job.id,
    state: 'queued',
    mediaType: 'video',
    imagePath: staticResult.imagePath,
    degraded: false
  });
}

module.exports = { createJob: createJob, completeStatic: completeStatic, requestMotion: requestMotion };
