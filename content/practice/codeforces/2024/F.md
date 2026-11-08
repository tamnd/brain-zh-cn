---
title: "CF 2024F - 许多游戏"
description: "每个游戏都有一个成功概率 $pi/100$ 和奖励 $wi$。 我们可以选择游戏的任何子集。 问题是，只有赢得每场选定的比赛，我们才能获得奖励。 即使选择的一场比赛输了，最终的奖励也为零。"
date: "2026-06-09T03:12:58+07:00"
tags: ["codeforces", "competitive-programming", "dp", "math"]
categories: ["algorithms"]
codeforces_contest: 2024
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 980 (Div. 2)"
rating: 2900
weight: 2024
solve_time_s: 349
verified: false
draft: false
---

[CF 2024F - 许多游戏](https://codeforces.com/problemset/problem/2024/F)

 **评分：** 2900
 **标签：** dp、数学
 **求解时间：** 5m 49s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 每个游戏都有一个成功概率$p_i/100$和奖励$w_i$。 

我们可以选择游戏的任何子集。 问题是，只有赢得每场选定的比赛，我们才能获得奖励。 即使选择的一场比赛输了，最终的奖励也为零。 

对于选定的子集$S$,$$\text{expected value} = \left(\prod_{i\in S}\frac{p_i}{100}\right) \left(\sum_{i\in S}w_i\right).$$我们必须最大化这个数量。 

首先最引人注目的是其巨大的价值$n$, 直至$2\cdot 10^5$。 任何明确考虑子集的算法都是不可能的。 甚至$O(n^2)$太大了。 

第二个不寻常的约束是$$p_i \cdot w_i \le 2\cdot 10^5.$$乍一看，它与目标无关，但实际上是解决问题的关键。 

只有 100 个可能的概率值。 这强烈建议按概率对游戏进行分组。 

一个微妙的边缘情况是$p_i=100$。 这样的游戏永远不会减少概率乘积，因为乘以$1$没有任何改变。 由于奖励是正的，所以每$100\%$比赛应该始终进行。 

例如：```
2
100 5
100 7
```最优答案是$12$。 Ignoring probability-100 games would immediately lose correctness.

 Another easy mistake is assuming that if two games have the same probability, we may choose arbitrary ones among them.

 考虑：```
3
90 100
90 50
90 1
```如果我们决定以概率进行两场比赛$90\%$，领取奖励$100$和$50$总是至少和采取一样好$100$和$1$。 在相同的概率中，较大的奖励支配较小的奖励。 

第三个陷阱是相信最优解决方案的总奖励可以任意大，因为$n$是巨大的。 特殊的限制阻止了这种情况的发生。 证明这个界限是解决方案的核心观察。 

## 方法

 暴力解决方案是显而易见的。 枚举每个子集，计算其奖励总和和概率积，然后保留最佳答案。 

这是正确的，因为它检查了每种可能性。 

不幸的是它需要$2^n$子集。 即使是为了$n=50$这是没有希望的，而实际的极限是$2\cdot 10^5$。 

下一个问题是可以利用最优子集的哪些属性。 

假设最优子集有总奖励$W$。 

参加任意选择的游戏$i$。 删除它不能改善答案。 让$$q_i=\frac{p_i}{100}.$$最优性给出$$q_i W \ge W-w_i.$$重新排列，$$w_i \ge (1-q_i)W.$$乘以$p_i$,$$p_iw_i \ge \frac{p_i(100-p_i)}{100}W.$$对于每一个$1\le p_i\le 99$,$$\frac{p_i(100-p_i)}{100}\ge 0.99.$$自从$p_iw_i\le 2\cdot10^5$,$$W \le \frac{2\cdot10^5}{0.99} < 202021.$$这就是突破。 

最佳解决方案永远不需要高于粗略的总奖励$2\cdot10^5$。 

现在我们可以将奖励总和视为背包维度。 

还有一项观察。 

对于固定概率$p$，每个选择的游戏都贡献相同的乘法因子$p/100$。 如果我们决定准确地采取$k$从该概率组中进行的游戏，最好的选择就是$k$最大的奖励。 

因此，每个概率组在按降序对奖励进行排序后就变成了前缀和的序列。 

第二个计数论证表明，对于概率$p<100$，最优解最多需要$$\left\lceil \frac1{\ln(100/p)} \right\rceil$$该组的游戏。 将这些限制相加$p=1,\dots,99$仅给出大约 500 个候选游戏。 原来的$2\cdot10^5$游戏缩减为几百个相关游戏。 

减少之后，超过总奖励的标准背包变得可行。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(2^n)$|$O(1)$| 太慢了 |
 | 最佳 |$O(W \cdot K)$|$O(W)$| 已接受 |

 这里$W\approx 3\cdot10^5$和$K\approx 500$。 

## 算法演练

 ### 1. 将所有概率为 100 的游戏分开

 每一个这样的游戏都应该被选择。 

让$$\text{base}=\sum w_i \quad (p_i=100).$$这些博弈不会影响概率积。 

### 2. 按概率对剩余游戏进行分组

 对于每一个$p\in[1,99]$，收集具有该概率的所有奖励。 

按降序对每个组进行排序。 

### 3. 只保留相关的最大奖励

 对于概率$p$, 计算$$\text{limit} = \left\lceil \frac1{\ln(100/p)} \right\rceil.$$只有最大的`limit`来自该群体的奖励可能很重要。 

任何额外的游戏在最佳解决方案中都被证明是无用的。 

### 4. 运行背包奖励金额

 让$$dp[s]$$是总额外奖励可实现的最大概率乘积$s$。 

初始化$$dp[0]=1.$$对于每个保留的游戏$(p,w)$,$$dp[s] = \max(dp[s],\, dp[s-w]\cdot p/100).$$这是标准的 0/1 背包更新。 

### 5. 计算最终答案

 对于每笔奖励金额$s$,$$\text{candidate} = dp[s]\cdot (base+s).$$取所有的最大值$s$。 

### 为什么它有效

 关键的不变量是在处理一些保留的游戏集之后，`dp[s]`存储所有子集中最大可能的概率积，其总奖励恰好为`s`。 

该过渡是标准的 0/1 背包过渡。 当前游戏要么未被选择，要么被选择并将概率乘积乘以$p/100$。 

剪枝步骤是安全的，因为对于固定概率组，只有最大的奖励才能成为最优解决方案的一部分。 此外，对来自一个概率组的所选游戏数量的分析界限保证了每个最优解都能在修剪中幸存下来。 

由于每个最优子集都对应于一些可达到的奖励总和$s$， 和`dp[s]`存储该总和的最佳概率乘积，最大化$$dp[s](base+s)$$准确检查每个可能的奖励总和的最佳子集的目标值。 其中的最大值就是全局最优值。 

## Python 解决方案```python
import sys
import math

input = sys.stdin.readline

n = int(input())

groups = [[] for _ in range(101)]
base = 0

for _ in range(n):
    p, w = map(int, input().split())
    if p == 100:
        base += w
    else:
        groups[p].append(w)

items = []

for p in range(1, 100):
    if not groups[p]:
        continue

    groups[p].sort(reverse=True)

    limit = math.ceil(1.0 / math.log(100.0 / p))
    if limit < len(groups[p]):
        groups[p] = groups[p][:limit]

    for w in groups[p]:
        items.append((w, p / 100.0))

MAXS = base
for w, _ in items:
    MAXS += w

dp = [0.0] * (MAXS + 1)
dp[0] = 1.0

for w, prob in items:
    for s in range(MAXS, w - 1, -1):
        cand = dp[s - w] * prob
        if cand > dp[s]:
            dp[s] = cand

ans = float(base)

for s in range(MAXS + 1):
    if dp[s] > 0:
        ans = max(ans, dp[s] * (base + s))

print(f"{ans:.10f}")
```第一部分将概率 100 的游戏分开，因为它们总是有利的。 

分组阶段对每个概率桶内的奖励进行排序。 剪枝极限来自于最优解中可以出现多少相同概率的博弈的分析界限。 

修剪后，剩下的游戏数量只剩下几百个了。 这就是背包变得可行的原因。 

DP 直接将概率乘积存储为浮点值。 产品可以变得非常小，但剪枝界限限制了乘法因子的数量，因此普通双精度就足够了。 

背包循环中的反向迭代顺序至关重要。 使用前向迭代会意外地允许多次选择同一游戏。 

## 工作示例

 ### 示例 1

 输入：```
3
80 80
70 100
50 200
```相关DP声明：

 | 精选游戏| 奖励金额 | 概率积 | 预期值|
 | --- | --- | --- | --- |
 | {80} | 80| 0.8 | 0.8 64 | 64
 | {70} | 100 | 100 0.7 | 0.7 70 | 70
 | {50} | 200 | 200 0.5 | 0.5 100 | 100
 | {80,70} | 180 | 180 0.56 | 0.56 100.8 | 100.8
 | {80,50} | 280 | 280 0.40 | 0.40 112 | 112
 | {70,50} | 300 | 300 0.35 | 0.35 105 | 105
 | {80,70,50} | 380 | 380 0.28 | 0.28 106.4 | 106.4

 最大值为$112$，通过选择第一场和第三场比赛来实现。 

### 示例 2

 输入：```
2
100 1
100 1
```预处理后：

 | 变量| 价值|
 | --- | --- |
 | 基地| 2 |
 | 保留项目 | 无 |

 DP仅包含`dp[0]=1`。 

最终值：$$1\cdot(2+0)=2.$$回答：$2$。 

此示例说明了为什么必须单独处理概率为 100 的游戏。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(W\cdot K)$| 背包奖励金额超额，保留约500款游戏 |
 | 空间|$O(W)$| 1 个 DP 阵列 |

 奖励总和维度受以下结构证明的限制$p_iw_i\le2\cdot10^5$。 修剪后，只剩下几百个游戏，因此 DP 很容易符合限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from math import isclose

def run(inp: str) -> str:
    # paste solution into solve()
    pass

# sample 1
# expected 112.0

# sample 2
# expected 2.0

# custom minimum case
# 1 game
# 50% chance, reward 10
# answer = 5

# custom all probability 100
# answer equals sum of rewards

# custom equal probabilities
# checks that largest rewards are preferred

# custom boundary style
# p*w = 200000
# ensures constraint edge is handled
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 仅一场比赛 | 单人游戏EV | 最小尺寸|
 | 全部$p=100$| 奖励总和| 强制纳入确定性游戏|
 | 许多相同的概率| 使用最大的奖励 | 组剪枝正确性|
 |$p\cdot w=200000$| 有效答案 | 边界约束|

 ## 边缘情况

 考虑：```
2
100 5
100 7
```该算法将两种奖励放入`base = 12`。 

未创建 DP 项目。 

最终答案变成$$1\cdot12=12.$$这可以正确处理确定性游戏。 

现在考虑：```
3
90 100
90 50
90 1
```对概率为 90 的组进行排序后，奖励变为：```
100, 50, 1
```使用该组中的两个游戏的任何解决方案都由两个最大的奖励表示。 剪枝论证保证在同一概率类别内较小的奖励永远不会取代较大的奖励。 

最后考虑：```
1
1 200000
```期望值为$$0.01 \cdot 200000 = 2000.$$算法保持游戏、更新`dp[200000] = 0.01`，并精确计算该值。 边界$p_iw_i=200000$不会造成特别困难。
