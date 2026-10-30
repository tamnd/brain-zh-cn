---
title: "CF 1575F - 寻找期望值"
description: "我们从一个值在 [0, k - 1] 范围内的数组开始。 只要不是所有位置都包含相同的值，我们就会重复选择一个随机位置和一个随机值，然后覆盖该位置。"
date: "2026-06-10T10:55:13+07:00"
tags: ["codeforces", "competitive-programming", "math"]
categories: ["algorithms"]
codeforces_contest: 1575
codeforces_index: "F"
codeforces_contest_name: "COMPFEST 13 - Finals Online Mirror (Unrated, ICPC Rules, Teams Preferred)"
rating: 2900
weight: 1575
solve_time_s: 76
verified: true
draft: false
---

[CF 1575F - 查找期望值](https://codeforces.com/problemset/problem/1575/F)

 **评分：** 2900
 **标签：** 数学
 **求解时间：** 1m 16s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们从一个数组开始，其值在范围内`[0, k - 1]`。 只要不是所有位置都包含相同的值，我们就会重复选择一个随机位置和一个随机值，然后覆盖该位置。 

对于完全指定的数组`b`， 让`f(b)`是直到每个元素变得相等为止的预期操作数。 

仅部分指定输入数组。 部分职位包含`-1`。 每个这样的位置都被独立地替换为均匀随机值`[0, k - 1]`。 全部替换后，我们得到一个随机的完整数组。 任务是计算期望值`f`超过所有此类完成情况。 

声明中最引人注目的部分是`k`可以大到`10^9`。 任何依赖于颜色迭代的解决方案都是不可能的。 同时，`n`只是`10^5`，这强烈表明最终公式应该取决于频率计数而不是单个颜色。 

第二个观察结果是随机过程本身具有巨大的状态空间。 即使对于中等`n`，存储所有可能的数组是没有希望的。 我们需要一种无需构建马尔可夫链即可计算预期命中时间的方法。 

棘手的情况是涉及当前未出现的颜色的情况。 

考虑：```
n = 3, k = 10
a = [0, 0, 1]
```有八种频率为零的颜色。 他们的贡献不能简单地被忽视，因为在填补未知职位后，他们仍然参与期望公式。 

另一个容易犯的错误是仅计算当前呈现颜色的期望。```
n = 3, k = 3
a = [-1, -1, -1]
```每种颜色都是对称的。 预期的答案取决于最终有多少位置接收每种颜色，而不取决于输入中碰巧出现哪些颜色。 

第三个陷阱是最终状态。 当所有元素都相等时，该过程立即停止。 任何势函数参数必须为每个终端配置分配相同的值，否则停止时间公式将变得不正确。 

## 方法

 暴力的观点是将每个阵列视为马尔可夫链的状态，并求解线性方程组以获得预期的命中时间。 

状态计数为`k^n`。 即使是为了`n = 10`和`k = 10`，这已经是`10^10`州。 该方法在数学上是正确的，但完全不可用。 

关键的观察结果是该过程仅取决于颜色频率。 

让`cnt(x)`表示颜色出现的次数`x`。 我们不直接研究数组，而是寻找潜在的函数$$F = \sum_x g(cnt(x))$$其在一项操作中的预期变化始终是`-1`。 

如果这样的函数存在，那么可选停止定理立即给出$$\mathbb E[\text{time to finish}] = F(\text{initial}) - F(\text{terminal}).$$这完全避免了求解马尔可夫链。 

推导出递推式后`g`，问题就变成纯粹的组合问题。 我们只需要期望值$$\sum_x g(cnt(x))$$全部随机替换后`-1`职位。 

每个未知位置独立选择其中之一`k`颜色。 因此，对于每种颜色，额外出现的次数遵循二项式分布。 仔细总结这些贡献可以得出`O(n)`解决方案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力马尔可夫链 | 指数| 指数| 太慢了 |
 | 势函数+二项式计数|`O(n)`|`O(n)`| 已接受 |

 ## 算法演练

 ### 激发潜力

 让$$F=\sum_x g(cnt(x)).$$假设一种颜色当前有频率`i`。 

如果我们选择该颜色的出现并将其重新着色为不同的颜色，则其频率会从`i`到`i-1`。 

如果我们将其他位置重新着色为该颜色，则其频率会从`i`到`i+1`。 

定义$$d_i=g(i)-g(i-1).$$计算预期变化`F`并要求它准确无误`-1`对于每个状态都给出条件$$(k-1)i\,d_i-(n-i)d_{i+1}=n.$$等价地，$$(k-1)i(g(i)-g(i-1)) + (n-i)(g(i)-g(i+1)) = n.$$我们设定$$g(0)=g(1)=0,$$并通过递归计算所有剩余值：$$g(i+1) = g(i) + \frac{(k-1)i(g(i)-g(i-1))-n}{n-i}.$$所有算术均以模进行`10^9+7`。 

### 填补未知职位后的预期贡献

 让`c`是`-1`条目。 

对于每种颜色，假设其当前已知频率等于`j`。 

填充未知位置后，额外出现的次数为$$X \sim \text{Binomial}(c,\tfrac1k).$$因此最终频率等于`j + X`。 

让`b[j]`表示已知频率恰好为的颜色数量`j`。 

那么最终频率等于的预期颜色数量`i`是$$\sum_j b[j] \Pr(X=i-j).$$二项式概率贡献$$\binom{c}{i-j} \left(\frac1k\right)^{i-j} \left(\frac{k-1}{k}\right)^{c-(i-j)}.$$而不是除以`k`重复地，我们累加分子$$\binom{c}{i-j}(k-1)^{c-(i-j)}$$并除以`k^c`一次在最后。 

###最终答案

 过程开始前势能的预期值为$$\mathbb E[F] = \sum_i g(i)\cdot \mathbb E[\#\text{colors with final frequency }i].$$每个终端状态都由一种颜色组成`n`次和所有其他出现的`0`次，所以它的潜力等于$$g(n).$$因此$$\mathbb E[f(a)] = \mathbb E[F]-g(n).$$这正是所需的答案。 

### 为什么它有效

 复发为`g`导出，以便每次操作都会降低期望值`F`无论当前配置如何，都恰好加一。 最后，$$F_t+t$$是鞅。 让`T`是所有元素第一次变得相等。 应用停止时间恒等式给出$$\mathbb E[T] = F(\text{start})-F(\text{finish}).$$解决方案的其余部分计算随机替换未知条目后的预期启动潜力。 由于期望是线性的，因此将每种颜色的二项式贡献相加即可得出精确的值`\mathbb E[F]`。 结合这两个部分可产生所需的预期停止时间。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 1000000007

def modpow(a, e):
    res = 1
    while e:
        if e & 1:
            res = res * a % MOD
        a = a * a % MOD
        e >>= 1
    return res

def solve():
    n, k = map(int, input().split())
    a = list(map(int, input().split()))

    freq = {}
    unknown = 0

    for x in a:
        if x == -1:
            unknown += 1
        else:
            freq[x] = freq.get(x, 0) + 1

    inv = [0] * (n + 1)
    inv[1] = 1
    for i in range(2, n + 1):
        inv[i] = (MOD - MOD // i) * inv[MOD % i] % MOD

    g = [0] * (n + 1)

    for i in range(1, n):
        term = ((k - 1) % MOD) * i % MOD
        term = term * ((g[i] - g[i - 1]) % MOD) % MOD
        term = (term + (n - i) * g[i] - n) % MOD
        g[i + 1] = term * inv[n - i] % MOD

    fac = [1] * (n + 1)
    ifac = [1] * (n + 1)

    for i in range(1, n + 1):
        fac[i] = fac[i - 1] * i % MOD

    ifac[n] = modpow(fac[n], MOD - 2)
    for i in range(n, 0, -1):
        ifac[i - 1] = ifac[i] * i % MOD

    def C(N, R):
        if R < 0 or R > N:
            return 0
        return fac[N] * ifac[R] % MOD * ifac[N - R] % MOD

    b = [0] * (n + 1)

    b[0] = k - len(freq)
    for v in freq.values():
        b[v] += 1

    pw = [1] * (unknown + 1)
    for i in range(1, unknown + 1):
        pw[i] = pw[i - 1] * ((k - 1) % MOD) % MOD

    nonzero = [i for i in range(n + 1) if b[i]]

    ans = 0

    for final_cnt in range(1, n + 1):
        ways = 0

        for base in nonzero:
            add = final_cnt - base
            if add < 0 or add > unknown:
                continue

            ways = (
                ways
                + b[base] % MOD
                * C(unknown, add)
                % MOD
                * pw[unknown - add]
            ) % MOD

        ans = (ans + ways * g[final_cnt]) % MOD

    ans = ans * modpow(modpow(k % MOD, unknown), MOD - 2) % MOD
    ans = (ans - g[n]) % MOD

    print(ans)

solve()
```第一个块计算潜在值`g(i)`从派生的递归。 仅频率高达`n`需要。 

下一个块准备阶乘和逆阶乘，以便可以在恒定时间内评估每个二项式系数。 

大批`b`存储当前有多少种颜色具有每个已知频率。 这会将所有颜色压缩为仅`n + 1`频率类别。 

对于每个可能的最终频率`i`，我们计算以该频率结尾的预期颜色数量。 二项式系数选择有多少未知位置加入给定颜色，而`(k - 1)^(...)`选择其他颜色来解释剩余的未知位置。 

累计值仍然包含一个共同点`k^c`， 在哪里`c`是未知位置的数量。 我们最后除以模逆数。 

最后我们减去`g(n)`，每个终端状态的潜力。 

## 工作示例

 ### 示例 1

 输入：```
2 2
0 1
```没有未知的职位。 

| 变量| 价值|
 | --- | --- |
 |`unknown`| 0 |
 | 频率 | `{0:1, 1: |
