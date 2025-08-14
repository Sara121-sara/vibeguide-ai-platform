# Stripe 支付集成设置指南

## 🎯 概述

VibeGuide 已集成 Stripe 支付系统，支持用户购买点数来使用 AI 文档生成服务。

## 📋 设置步骤

### 1. 注册 Stripe 账户

1. 访问 [Stripe Dashboard](https://dashboard.stripe.com/register)
2. 注册并验证账户
3. 完成企业信息填写

### 2. 获取 API 密钥

在 Stripe Dashboard 中：

1. 进入 **开发者** > **API 密钥**
2. 复制以下密钥：
   - **发布密钥** (pk_test_...)
   - **密钥** (sk_test_...)

### 3. 配置环境变量

在 `.env.local` 文件中添加：

```bash
# Stripe 配置
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
```

### 4. 设置 Webhook

1. 在 Stripe Dashboard 进入 **开发者** > **Webhooks**
2. 点击 **添加端点**
3. 配置 Webhook：
   - **端点 URL**: `https://your-domain.com/api/stripe/webhook`
   - **事件类型**: 选择 `checkout.session.completed`
4. 复制 **签名密钥** 到环境变量中

## 🔧 技术实现

### 支持的功能

- ✅ **一次性付费**: 用户购买点数包
- ✅ **安全支付**: Stripe 托管支付页面
- ✅ **自动充值**: 支付成功后自动添加点数
- ✅ **支付验证**: Webhook 验证支付状态

### 价格配置

当前支持的套餐：

```typescript
const PRICE_PLANS = {
  starter: {
    name: '入门套餐',
    amount: 100, // ¥1.00 (以分为单位)
    credits: 2,
  },
  pro: {
    name: '专业套餐', 
    amount: 500, // ¥5.00 (以分为单位)
    credits: 12,
  },
};
```

### API 路由

- `POST /api/stripe/create-checkout-session` - 创建支付会话
- `POST /api/stripe/webhook` - 处理支付回调

## 🚀 使用流程

1. **用户选择套餐** → 点击购买按钮
2. **创建支付会话** → 调用 Stripe API
3. **重定向到 Stripe** → 安全支付页面
4. **用户完成支付** → Stripe 处理付款
5. **Webhook 通知** → 自动添加点数
6. **支付成功页面** → 引导用户使用

## 🛡️ 安全考虑

- **PCI 合规**: 使用 Stripe 托管支付页面
- **Webhook 验证**: 验证 Stripe 签名
- **用户验证**: 确认用户身份
- **幂等性**: 防止重复充值

## 🧪 测试

### 测试卡号

使用以下测试卡号进行测试：

- **成功**: `4242 4242 4242 4242`
- **失败**: `4000 0000 0000 0002`
- **需要 3D 验证**: `4000 0025 0000 3155`

### 测试流程

1. 使用测试密钥配置环境变量
2. 在价格页面点击购买按钮
3. 使用测试卡号完成支付
4. 验证点数是否正确添加

## 🔍 故障排除

### 常见问题

**1. 支付按钮显示"请配置Stripe支付"**
- 检查 `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` 是否正确配置

**2. 支付成功但点数未添加**
- 检查 Webhook 端点是否正确配置
- 查看服务器日志中的 Webhook 处理信息

**3. Webhook 验证失败**
- 确认 `STRIPE_WEBHOOK_SECRET` 配置正确
- 检查 Webhook 端点 URL 是否可访问

### 调试日志

查看以下日志：
- Stripe Dashboard 中的事件日志
- 应用服务器的 console.log 输出
- Webhook 端点的响应状态

## 🌟 生产环境部署

### 切换到生产模式

1. 在 Stripe Dashboard 切换到 **实时模式**
2. 获取实时环境的 API 密钥
3. 更新生产环境的环境变量
4. 重新配置 Webhook 端点

### 监控和维护

- 定期检查 Stripe Dashboard 中的交易记录
- 监控 Webhook 的成功率
- 关注异常支付和退款请求