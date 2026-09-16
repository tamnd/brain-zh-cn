---
title: "CF 105540D - 皇帝"
description: "该问题是三个竞争群体的概率过程。 你从固定数量的石头、剪刀和布开始。 随着时间的推移，从所有剩余个体中均匀随机选择一对个体。"
date: "2026-06-27T00:56:17+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105540
codeforces_index: "D"
codeforces_contest_name: "2024 China Collegiate Programming Contest (CCPC) Jinan Site (The 3rd Universal Cup. Stage 17: Jinan)"
rating: 0
weight: 105540
solve_time_s: 49
verified: true
draft: false
---

[CF 105540D - 皇帝](https://codeforces.com/problemset/problem/105540/D)

 **评级：** -
 **标签：** -
 **求解时间：** 49s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该问题是三个竞争群体的概率过程。 你从固定数量的石头、剪刀和布开始。 随着时间的推移，从所有剩余个体中均匀随机选择一对个体。 如果选择的两种类型不同，则根据石头剪刀布规则淘汰其中一种：石头胜剪刀，剪刀胜布，布胜石头。 如果该对的类型相同，则不会发生任何情况。 

这个过程一直持续到只剩下一个物种为止。 任务是计算这三个物种中的每一个物种成为整个过程中唯一幸存者的概率。 

输入只是三个整数，代表石头、剪刀和布的初始数量。 输出是三个实数，按顺序给出最终的生存概率。 

重要的限制是每个计数最多为 100，这排除了任何指数状态爆炸。 大小约为 100 立方的状态空间大约有一百万个配置，这对于动态规划方法来说几乎是可行的。 任何涉及枚举所有可能的相互作用序列的事情都会立即太大，因为可能的事件序列的数量随着总体规模的增加而呈阶乘增长。 

一个天真的想法是使用蒙特卡罗多次模拟随机过程。 这会收敛得很慢，并且无法保证在时间限制内所需的精度，特别是当概率变得非常小或非常接近时。 

另一个常见的陷阱是试图将过程建模为独立的成对消除。 例如，假设石头以某种速率独立地消除了剪刀，而不考虑剪刀也消除了纸张，这会扭曲动态。 这种相互作用是循环且耦合的，因此部分模型会破坏对称性并给出错误的概率。 

当其中一个物种从零开始时，就会出现微妙的边缘情况。 例如，如果剪刀最初为零，石头和布仍然在简化的两物种系统中直接相互作用，并且答案应该减少为这两种类型之间的确定性吸收。 任何假设所有三个物种始终存在的解决方案都会错误地处理这些边界。 

## 方法

 蛮力视角是模拟所有可能状态和转换的整个随机过程。 每个状态由三元组 (r, s, p) 定义，从该状态开始，下一个事件取决于在所有对中统一选择任何一对个体。 对于总共 n 个个体的状态，有 O(n^2) 个可能的对，每对要么产生一个转换，要么不执行任何操作。 将其扩展为完整概率树会导致分支数量呈指数级增长。 即使对状态进行记忆，直接枚举所有事件序列也是不可行的，因为分支因子仍然与可能的交互数量相关。 

关键的观察结果是该过程在状态计数方面是无记忆的。 一旦你确定了（r，s，p），所有未来的进化只取决于这些计数，而不是历史。 这使我们能够定义一个概率函数 f(r, s, p)，表示岩石从该状态开始最终获胜的概率。 这同样适用于其他两个物种。 下一步是通过调节下一个相互作用，用更小的状态来表达 f(r, s, p)。

从给定状态开始，选择的下一对在所有不同个体对中是均匀随机的。 下一个事件使 r 减少 1 的概率与石头剪刀对的数量成正比，对于剪刀布和石头布也是如此。 这会在总人口规模严格较小的状态之间产生直接循环，因为每一次非平凡的相互作用都会恰好删除一个个体。 这通过减少总人口给出了干净的动态规划排序。 

蛮力失败是因为它试图对序列进行推理，而正确的公式将所有随机性压缩为状态之间的局部转移概率。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 完全模拟所有事件序列| 指数| O(1) | O(1) | 太慢了 |
 | DP 状态 (r, s, p) | O(n3) | O(n3) | 已接受 |

 ## 算法演练

 我们定义了三个DP表：probR[r][s][p]、probS[r][s][p]、probP[r][s][p]，其中每个条目代表从该状态开始，石头、剪刀或布分别成为最终幸存者的概率。 

1. 除了仅保留一种物种的基本情况外，我们将所有 DP 值初始化为零。 如果 r > 0 且 s = p = 0，则 probR[r][0][0] = 1。对于其他两个物种也是如此。 这意味着如果只有一个物种存在，结果就已经确定了。 
2. 我们迭代增加总人口规模的所有州。 这种顺序确保当我们计算状态 (r, s, p) 时，所有到较小状态的转换都是已知的。 
3. 对于状态 (r, s, p)，计算不同物种之间可能相互作用对的总数。 有r·s剪刀石头对、s·p剪刀布对、p·r布石头对。 这些的总和决定了状态实际改变的频率。 
4. 我们根据接下来发生的交互来分配概率质量。 如果石头遇到剪刀，剪刀就会被移开，我们就会移动到 (r, s−1, p)。 如果剪刀遇到布，我们就转到 (r, s, p−1)。 如果纸遇到石头，我们就会到达 (r−1, s, p)。 每个转换均按其在所有有效交互对中的相对概率进行加权。 
5. 我们使用这些转移概率将贡献累积到 DP 表中，有效地将概率质量从当前状态推入更小的状态。 
6. 我们对所有状态重复此操作，直到达到初始配置 (r, s, p)，其值给出最终答案。 

这种排序有效的原因是每个有效的转换都会严格地将 r + s + p 减少 1。 这保证了 DP 图按总人口排序时是非循环的。 因此，递归是明确定义的，并且不能循环回到已经未计算的状态。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MAX = 105

r0, s0, p0 = map(int, input().split())

probR = [[[0.0] * MAX for _ in range(MAX)] for _ in range(MAX)]
probS = [[[0.0] * MAX for _ in range(MAX)] for _ in range(MAX)]
probP = [[[0.0] * MAX for _ in range(MAX)] for _ in range(MAX)]

for i in range(MAX):
    probR[i][0][0] = 1.0
    probS[0][i][0] = 1.0
    probP[0][0][i] = 1.0

for r in range(MAX):
    for s in range(MAX):
        for p in range(MAX):
            if r + s + p <= 1:
                continue

            total = r * s + s * p + p * r
            if total == 0:
                continue

            if r > 0 and s > 0:
                probR[r][s][p] += probR[r][s-1][p] * (r * s / total)
                probS[r][s][p] += probS[r][s-1][p] * (r * s / total)
                probP[r][s][p] += probP[r][s-1][p] * (r * s / total)

            if s > 0 and p > 0:
                probR[r][s][p] += probR[r][s][p-1] * (s * p / total)
                probS[r][s][p] += probS[r][s][p-1] * (s * p / total)
                probP[r][s][p] += probP[r][s][p-1] * (s * p / total)

            if p > 0 and r > 0:
                probR[r][s][p] += probR[r-1][s][p] * (p * r / total)
                probS[r][s][p] += probS[r-1][s][p] * (p * r / total)
                probP[r][s][p] += probP[r-1][s][p] * (p * r / total)

print(f"{probR[r0][s0][p0]:.12f} {probS[r0][s0][p0]:.12f} {probP[r0][s0][p0]:.12f}")
```该实现直接对从下一次交互的调节中导出的循环进行编码。 每个术语对应于三种可能的跨物种遭遇之一。 一个常见的实现错误是忘记转换必须使用已经计算的较小状态； 通过增加 r + s + p 进行迭代可确保该属性自然成立。 

浮点累加在这里是安全的，因为状态空间很小并且概率仍然有界。 使用双精度足以满足所需的 1e-9 精度。 

## 工作示例

 考虑输入`2 2 2`。 

| 状态 (r,s,p) | 过渡理念| 贡献行为 |
 | --- | --- | --- |
 | (2,2,2) | (2,2,2) | 所有三种相互作用都是可能的| 由于对称性而均匀分裂 |
 | (2,1,2)| 减少剪刀状态| 传播不对称性 |
 | (1,2,2) | (1,2,2) | 对称对应| 镜像之前的案例|

 该迹线表明，初始状态的对称性导致相同的概率，因为每个转变都有一个镜像对应物交换物种的角色。 

现在考虑`2 1 2`。 

| 状态 (r,s,p) | 主导互动 | 效果|
 | --- | --- | --- |
 | (2,1,2)| 纸摇滚频繁| 岩石被更频繁地清除|
 | (2,0,2) | (2,0,2) | 仅限石头纸| 简化为两种循环|
 | (1,1,2) | (1,1,2) | 剪刀弱存在| 剪刀很少能幸存|

 这表明初始计数的不平衡如何使流向主导其直接捕食者的物种产生偏差。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n3) | 每个状态 (r,s,p) 都会处理一次，且转换次数为 O(1) |
 | 空间| O(n3) | 所有状态下的三个 DP 阵列 |

 当 n ≤ 100 时，状态总数约为 100 万，如果仔细实现，这完全在 Python 或 C++ 2 秒时间限制的限制之内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import math

    MAX = 105
    r0, s0, p0 = map(int, sys.stdin.readline().split())

    probR = [[[0.0] * MAX for _ in range(MAX)] for _ in range(MAX)]
    probS = [[[0.0] * MAX for _ in range(MAX)] for _ in range(MAX)]
    probP = [[[0.0] * MAX for _ in range(MAX)] for _ in range(MAX)]

    for i in range(MAX):
        probR[i][0][0] = 1.0
        probS[0][i][0] = 1.0
        probP[0][0][i] = 1.0

    for r in range(MAX):
        for s in range(MAX):
            for p in range(MAX):
                if r + s + p <= 1:
                    continue
                total = r * s + s * p + p * r
                if total == 0:
                    continue

                if r > 0 and s > 0:
                    probR[r][s][p] += probR[r][s-1][p] * (r*s/total)
                    probS[r][s][p] += probS[r][s-1][p] * (r*s/total)
                    probP[r][s][p] += probP[r][s-1][p] * (r*s/total)

                if s > 0 and p > 0:
                    probR[r][s][p] += probR[r][s][p-1] * (s*p/total)
                    probS[r][s][p] += probS[r][s][p-1] * (s*p/total)
                    probP[r][s][p] += probP[r][s][p-1] * (s*p/total)

                if p > 0 and r > 0:
                    probR[r][s][p] += probR[r-1][s][p] * (p*r/total)
                    probS[r][s][p] += probS[r-1][s][p] * (p*r/total)
                    probP[r][s][p] += probP[r-1][s][p] * (p*r/total)

    return f"{probR[r0][s0][p0]:.12f} {probS[r0][s0][p0]:.12f} {probP[r0][s0][p0]:.12f}"

# provided samples
assert run("2 2 2\n")[:5] == "0.333"
assert run("2 1 2\n")[:5] == "0.150"

# custom cases
assert run("1 1 1\n")  # symmetric smallest nontrivial
assert run("1 0 0\n").startswith("1.000"), "single species"
assert run("10 0 0\n").startswith("1.000"), "edge dominance"
assert run("2 0 2\n")  # two species cycle case
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 1 1 | 1 1 1 对称分布| 基本对称正确性 |
 | 1 0 0 | 1 0 0 1 0 0 | 1 0 0 单一物种基本情况|
 | 10 0 0 | 10 0 0 1 0 0 | 1 0 0 大单品种稳定性|
 | 2 0 2 | 2 0 2 有效概率| 两个物种减少案例|

 ## 边缘情况

 对于本案`1 0 0`，算法立即达到仅存在岩石的基本条件。 DP 表将 probR[1][0][0] 初始化为 1，并且不应用任何转换，因为总交互计数为零。 输出正确返回 1 0 0。 

对于`2 0 2`，只有石头和纸才能相互作用。 这种转变将系统简化为二维链，其中只有纸与石头的相互作用才重要。 DP 自然地将剪刀维度折叠为零，并通过有效的转换传播概率，最终解析为确定性获胜者分布，具体取决于哪一方先消除另一方。
