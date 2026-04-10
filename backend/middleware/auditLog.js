const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Middleware factory that logs admin actions to the audit_logs table.
 * Usage: router.patch('/orders/:id', auditLog('UPDATE_ORDER_STATUS', 'order'), handler)
 */
function auditLog(action, entityType, getEntityId = (req) => req.params.id) {
  return async (req, res, next) => {
    // Capture original res.json to intercept the response
    const originalJson = res.json.bind(res);
    res.json = function (data) {
      // Log asynchronously — do not block the response
      const entityId = getEntityId(req);
      prisma.audit_logs.create({
        data: {
          admin_id: req.user?.id && req.user.id !== 999999 ? Number(req.user.id) : null,
          admin_name: req.user?.username || req.user?.name || req.user?.email || 'admin',
          action,
          entity_type: entityType,
          entity_id: entityId ? Number(entityId) : null,
          new_value: req.body ? JSON.stringify(req.body).substring(0, 2000) : null,
          ip_address: req.ip || req.headers['x-forwarded-for'] || null,
        },
      }).catch((err) => console.error('Audit log error:', err.message));

      return originalJson(data);
    };

    next();
  };
}

module.exports = auditLog;
