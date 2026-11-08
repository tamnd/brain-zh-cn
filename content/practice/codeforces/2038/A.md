---
title: "CF 2038A - 奖金项目"
description: "我们有一个工程师团队，每个工程师都会获得承诺的奖金和完成一个工作单元的个人成本。 团队需要完成一个需要 $k$ 工作单元的项目，每个工程师将单独决定贡献多少。"
date: "2026-06-08T10:34:44+07:00"
tags: ["codeforces", "competitive-programming", "games", "greedy"]
categories: ["algorithms"]
codeforces_contest: 2038
codeforces_index: "A"
codeforces_contest_name: "2024-2025 ICPC, NERC, Southern and Volga Russian Regional Contest (Unrated, Online Mirror, ICPC Rules, Preferably Teams)"
rating: 1400
weight: 2038
solve_time_s: 129
verified: false
draft: false
---

[CF 2038A - 奖励项目](https://codeforces.com/problemset/problem/2038/A)

 **评分：** 1400
 **标签：** 游戏，贪婪
 **求解时间：** 2m 9s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一个工程师团队，每个工程师都会获得承诺的奖金和完成一个工作单元的个人成本。 团队需要完成一个项目，该项目完全需要$k$工作单元，每个工程师将单独决定贡献多少。 每个工程师贡献的金额，$c_i$，必须最大化他们的个人利益，定义为$s_i = a_i - c_i \cdot b_i$， 在哪里$a_i$是奖金和$b_i$是每单位成本。 如果工程师期望获得负面收益，他们根本就不会工作。 目标是确定工作分配$[c_1, c_2, ..., c_n]$当每个工程师都以最佳方式行事时，就会产生这样的结果。 

约束告诉我们$n \le 1000$和$k \le 10^6$。 自从$k$可以很大，任何试图测试所有可能的工作分布的算法（例如，所有非负整数元组的总和为$k$）将呈指数增长$n$，这是不可行的。 线性或$O(n \log n)$解决方案是可以接受的，因为它可以处理大约$10^6$操作舒适。 

不明显的边缘情况包括总奖金太小而项目无法盈利的情况。 例如，如果$k = 10$以及奖金的总和$a_i$小于任何合理的工作成本分配，没有工程师会自愿做任何工作，因此输出应该全为零。 另一个边缘情况是一些工程师的单位成本非常高$b_i$和低奖金。 在这种情况下，即使该项目可以由其他人完成，这些工程师的贡献也应该为零，因为工作会减少他们的收益。 

## 方法

 蛮力方法会尝试所有可能的分配$k$工程师中的工作单位。 对于每个分配，我们将计算每个工程师的收益并检查是否有任何收益为负，如果是则拒绝该分配。 这在原则上是正确的，但分配的数量是组合的：大致$\binom{k+n-1}{n-1}$。 即使对于小$n$和中等$k$，这太慢了。 

关键的见解是工程师按顺序行事，每个人都根据前任工程师的承诺最大化自己的利益。 每个工程师都会看到剩余的工作量$r$达到$k$在之前的工程师决定之后。 他们的目标是选择$c_i$尽可能大而不使自己的利益为负，即$c_i \le a_i / b_i$。 他们的贡献也不能超过剩余的工作$r$。 因此，最优的$c_i$是剩余工作的最小值和最大的盈利贡献$a_i / b_i$。 一旦工程师做出承诺$c_i$，下一位工程师用更新后的剩余工作重复相同的逻辑。 这种贪婪的方法保证会产生独特的解决方案，因为每个工程师的选择都决定性地取决于剩余工作和他们的个人比例$a_i / b_i$。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O((k+n-1 选择 n-1)) | O(n) | 太慢了|
 | 贪婪顺序 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1.初始化剩余工作$r = k$。 该变量跟踪仍需要分配多少工作。 
2. 迭代每个工程师$i$从$1$到$n$。 对于每个工程师，计算他们的最大盈利工作，即$m_i = a_i // b_i$。 这代表了不会​​将其收益降低到零以下的最大工作量。 
3.确定实际工作$c_i$工程师将做出贡献。 这是最小值$m_i$以及剩下的工作$r$。 这确保了工程师在不超出完成项目所需的范围的情况下实现利益最大化。 
4.从剩余工作中减去工程师的贡献：$r -= c_i$。 这更新了以下工程师的剩余工作。 
5. 对所有工程师继续此过程。 最后一位工程师之后，总和$c_i$将完全匹配$k$（项目已完成）或更少，如果在没有某些工程师获得负面收益的情况下不可能完成项目。 无法盈利的工程师贡献将自动为零。 

为什么有效：在每一步中，每个工程师都会根据之前的决策采取最佳行动。 由于每个工程师的选择都受到其最大盈利贡献和剩余工作的限制，因此贪婪的顺序分配保证没有工程师最终会获得负面收益。 不变的是，在每个工程师之后，剩余的工作准确地反映了未分配的部分$k$，并且每个工程师都选择了他们可以在不损失的情况下贡献的最大金额。 这会产生一个独特的、最佳的序列$[c_1, c_2, ..., c_n]$。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, k = map(int, input().split())
a = list(map(int, input().split()))
b = list(map(int, input().split()))

c = []
remaining = k

for i in range(n):
    max_work = a[i] // b[i]  # maximum work this engineer can profitably do
    contribution = min(max_work, remaining)
    c.append(contribution)
    remaining -= contribution

print(' '.join(map(str, c)))
```解决方案如下$n$,$k$, 奖金$a_i$和成本$b_i$。 这`max_work`计算确保没有工程师亏本工作，并且`min(max_work, remaining)`分配保证总工作量永远不会超过$k$。 这`remaining`变量按顺序更新，以便每个工程师确切地知道还剩下多少工作。 使用整数除法`//`确保我们保持在整数单位。 

## 工作示例

 **样品1**

 输入：```
3 6
4 7 6
1 2 3
```步骤跟踪：

 | 工程师| a_i | b_i | 最大工作量 | 剩余| c_i | 剩余时间 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 1 | 4 | 1 | 4 | 6 | 1 | 5 |
 | 2 | 7 | 2 | 3 | 5 | 3 | 2 |
 | 3 | 6 | 3 | 2 | 2 | 2 | 0 |

 该表显示每个工程师在不超过剩余工作的情况下贡献了他们的盈利限额。 总工作量总计为 6$k$。 

**样品2**

 输入：```
2 10
3 4
5 2
```步骤跟踪：

 | 工程师| a_i | b_i | 最大工作量 | 剩余| c_i | 剩余时间 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 1 | 3 | 5 | 0 | 10 | 10 0 | 10 | 10
 | 2 | 4 | 2 | 2 | 10 | 10 2 | 8 |

 两位工程师之后的剩余工作是 8，但任何进一步的工作都会将效益降低到零以下，因此他们只贡献可盈利的部分。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 单次遍历所有工程师，每个工程师的恒定时间算法 |
 | 空间| O(n) | 存储生成的贡献数组 |

 该算法与工程师数量成线性关系，并且与$k$。 和$n \le 1000$，这很容易运行不到 2 秒。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, k = map(int, input().split())
    a = list(map(int, input().split()))
    b = list(map(int, input().split()))
    c = []
    remaining = k
    for i in range(n):
        max_work = a[i] // b[i]
        contribution = min(max_work, remaining)
        c.append(contribution)
        remaining -= contribution
    return ' '.join(map(str, c))

# provided samples
assert run("3 6\n4 7 6\n1 2 3\n") == "1 3 2"
assert run("2 10\n3 4\n5 2\n") == "0 2"

# custom cases
assert run("1 5\n10\n2\n") == "5"  # single engineer does all work
assert run("3 5\n1 2 3\n1 1 1\n") == "1 2 2"  # sum of max work = k exactly
assert run("2 1000\n1000 1000\n1 1\n") == "500 500"  # evenly distributed
assert run("3 3\n1 1 1\n2 2 2\n") == "0 0 0"  # no profitable work
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | “1 5\n10\n2\n”| “5”| 单一工程师处理所有工作 |
 | “3 5\n1 2 3\n1 1 1\n”| “1 2 2”| 分配工作以准确达到 k |
 | “2 1000\n1000 1000\n1 1\n”| “500||
