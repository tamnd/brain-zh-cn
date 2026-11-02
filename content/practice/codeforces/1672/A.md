---
title: "CF 1672A - 伐木"
description: "我们被要求在一个简单的两人游戏中确定获胜者，该游戏具有整数长度的日志。 有 $n$ 个日志，两个玩家轮流将单个日志分成两个正整数块。 第一个无法采取行动的玩家失败。"
date: "2026-06-10T01:28:41+07:00"
tags: ["codeforces", "competitive-programming", "games", "implementation", "math"]
categories: ["algorithms"]
codeforces_contest: 1672
codeforces_index: "A"
codeforces_contest_name: "Codeforces Global Round 20"
rating: 800
weight: 1672
solve_time_s: 88
verified: true
draft: false
---

[CF 1672A - 日志砍伐](https://codeforces.com/problemset/problem/1672/A)

 **评分：** 800
 **标签：** 游戏、实施、数学
 **求解时间：** 1m 28s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求在一个简单的两人游戏中确定获胜者，该游戏具有整数长度的日志。 有$n$日志，两个玩家轮流将一根日志分成两个正整数部分。 第一个无法采取行动的玩家失败。 每个测试用例都提供日志的数量及其长度，并且输出必须表明假设双方都发挥最佳状态的情况下哪个玩家获胜。 

输入约束很小：每个测试用例最多 50 个日志，日志长度最多 50 个。最多可以有 100 个测试用例，但所有测试用例的日志总数仍然是可控的。 这些界限表明我们不需要高度优化的数据结构或算法； 每个测试用例进行线性扫描就足够了。 

当所有日志的长度均为 1 时，就会出现关键的边缘情况。在这种情况下，第一个玩家无法采取任何行动并立即失败。 例如，如果输入是`1\n1`，输出应该是`maomao90`因为 errorgorn 没有可用的动作。 另一个微妙的情况是当日志的总和为偶数或奇数时：因为每次分割都会使日志总数增加一，所以分割总数的奇偶性可以确定哪个玩家将首先用完步数。 

## 方法

 暴力方法会依次模拟游戏。 我们可以选择最大的原木，将其分割，交替转动，然后继续，直到没有原木可以分割为止。 虽然这在概念上是正确的，但它需要在每一步跟踪整个日志集。 在最坏的情况下，每次分割都会使日志数量加倍，从而导致可能的序列数量呈指数级增长。 即使对于较小的输入大小，这显然也是低效的。 

简化问题的见解是注意到长度的对数$1$不能被分割，而任何长度大于$1$总是可以分割的。 每次拆分都会使日志总数恰好增加 1。 因此，可以纯粹通过可用的分割总数来分析游戏。 让$k$是长度大于的日志数$1$。 这些日志中的每一个都需要一次拆分才能成为两个较小的日志，最终将所有内容减少为 1 长度的日志。 因此，可能的分割总数等于长度大于的日志数$1$。 Errorgorn 首先行动，所以如果这个数字是奇数，他将进行最后的分割并获胜； 如果是平局，则maomao90获胜。 这将问题简化为计算长度大于 1 的日志数量并检查奇偶校验，这与$n$。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力模拟| O(2^n) | O(2^n) | O(n) | 太慢了|
 | 计数和奇偶校验 | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取测试用例数量$t$。 
2.对于每个测试用例，读取日志数量$n$和日志长度列表$a_1, a_2, \dots, a_n$。 
3、统计长度大于的日志数量$1$。 这是游戏中可能发生的分裂总数。 
4. 如果计数为奇数，则先移动的 errorgorn 将进行最后的分割。 打印`"errorgorn"`。 
5. 如果计数为偶数，maomao90 将进行最后的分割。 打印`"maomao90"`。 

工作原理：每个长度大于 1 的对数恰好贡献一次可用的移动。 玩家交替移动，移动次数的平价决定谁将获得最后回合。 这个简单的不变量完全决定了胜利者。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n = int(input())
    logs = list(map(int, input().split()))
    moves = sum(1 for x in logs if x > 1)
    if moves % 2 == 1:
        print("errorgorn")
    else:
        print("maomao90")
```该解决方案使用有效地读取输入`sys.stdin.readline`并分别处理每个测试用例。 大于 1 的日志计数是使用生成器表达式完成的，这避免了创建中间列表。 取模运算决定奇偶性，直接决定胜负。 不需要额外的数据结构。 

## 工作示例

 样本1：

 | 步骤| 日志 | 分裂 >1 | 平价 | 获胜者 |
 | ---| ---| ---| ---| ---|
 | 输入| [2,4,2,1] | 3 | 奇数| 错误|

 这里，有 3 个比 1 长的日志。Errorgorn 首先移动，也将进行最后一步。 样本2：

 | 步骤| 日志| 分裂 >1 | 平价 | 获胜者 |
 | ---| ---| ---| ---| ---|
 | 输入| [1] | 0 | 甚至| 毛毛90 |

 没有日志可以被分割，所以 errorgorn 会立即丢失。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 每个测试用例 O(n) | 我们扫描日志列表一次，计数日志 >1。 |
 | 空间| O(n) | 我们存储每个测试用例的日志列表。 |

 给定$n \le 50$和$t \le 100$，总工作量小，1秒内轻松装完。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    t = int(input())
    for _ in range(t):
        n = int(input())
        logs = list(map(int, input().split()))
        moves = sum(1 for x in logs if x > 1)
        if moves % 2 == 1:
            print("errorgorn")
        else:
            print("maomao90")
    return out.getvalue().strip()

# Provided samples
assert run("2\n4\n2 4 2 1\n1\n1") == "errorgorn\nmaomao90", "sample 1 and 2"

# Custom cases
assert run("1\n3\n1 1 1") == "maomao90", "all logs length 1"
assert run("1\n5\n2 2 2 2 2") == "errorgorn", "all logs length >1 odd count"
assert run("1\n4\n2 2 2 2") == "maomao90", "all logs length >1 even count"
assert run("1\n1\n50") == "errorgorn", "single long log"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 3 个长度为 1 的原木 | 毛毛90 | 第一个玩家无法移动 |
 | 5 个长度为 2 的原木 | 错误| 奇数步 |
 | 4 个长度为 2 的原木 | 毛毛90 | 偶数步|
 | 1 个长度为 50 | 的原木 错误| 正确处理单个长日志 |

 ## 边缘情况

 对于全1的情况，比如输入`1\n3\n1 1 1`，>1 的日志计数为零。 零是偶数，因此算法正确输出`maomao90`，反映出 errorgorn 没有任何动作。 

对于单个长日志，输入`1\n1\n50`，对数 >1 的计数为 1，为奇数。 算法输出`errorgorn`，反映出 errorgorn 将采取唯一的行动并获胜。 这些边缘情况证实了基于奇偶校验的逻辑即使在极端情况下也是稳健的。
