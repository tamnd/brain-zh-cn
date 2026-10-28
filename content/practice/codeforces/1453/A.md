---
title: "CF 1453A - 取消列车"
description: "我们被要求管理 100×100 网格上的火车系统。 火车可以从下到上垂直移动，也可以从左到右水平移动。"
date: "2026-06-11T03:02:16+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1453
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 688 (Div. 2)"
rating: 800
weight: 1453
solve_time_s: 85
verified: true
draft: false
---

[CF 1453A - 取消火车](https://codeforces.com/problemset/problem/1453/A)

 **评分：** 800
 **标签：** 实施
 **求解时间：** 1m 25s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求管理 100×100 网格上的火车系统。 火车可以从下到上垂直移动，也可以从左到右水平移动。 每列火车根据其出发点都有一个从 1 到 100 的唯一编号，并且所有火车都以相同的恒定速度行驶。 在给定时刻，一些火车子集计划从底部出发，一些从左侧出发。 如果垂直列车和水平列车同时占据同一坐标，就会发生碰撞。 

目标是确定要取消的最少列车数量，以避免所有碰撞。 每个测试用例指定了调度的垂直和水平列车的数量及其列车编号。 每个测试用例的输出是一个整数：所需的最小取消次数。 

限制很小：每侧最多 100 个列车，最多 100 个测试用例。 这立即意味着每个测试用例大约有 O(n·m) 次操作（其中 n 和 m 是列车数量）的任何算法都将足够快。 每个列车编号在 1 到 100 之间，因此我们可以用数组或集合有效地表示列车时刻表。 

需要警惕的一种边缘情况是底部最小的列车编号与左侧最大的列车编号相匹配。 例如，如果底部列车 = [1] 且左侧列车 = [1]，则幼稚的方法可能会假设不会发生崩溃，因为数字是不同的列表，但实际上，网格位置在 (1,1) 处重叠。 另一种情况是当 n=1 或 m=1 时； 我们必须确保我们不会尝试比较不存在的元素。 

## 方法

 暴力方法将模拟每列火车的轨迹并检查每个可能的坐标处是否发生碰撞。 对于每列底部列车，您将其路径与每列左边的列车进行比较。 由于一列火车从 (i,0) 移动到 (i,101)，另一列火车从 (0,j) 移动到 (101,j)，因此它们的路径仅在点 (i,j) 相交。 这减少了这个问题：如果底部的火车与左侧的火车编号相同，就会发生碰撞。 利用这种洞察力，我们可以计算两个列表中出现的列车编号的数量； 这是潜在碰撞的最大数量。 从每对冲突的列车中取消一列列车就足以避免事故。 

关键的观察结果是，只有列车编号的交集才重要。 如果一个数字同时出现在底部和左侧的时刻表中，则这两列火车将会相撞。 由于我们可以取消任何一列冲突的列车来解决碰撞，因此所需的最小取消量是发生碰撞的垂直或水平列车数量中较小的一个。 然而，由于每个号码都是唯一的，最多一列垂直列车和一列水平列车共享一个号码，因此最小取消量恰好是交叉口的大小。 

这种见解将算法从潜在的 O(n·m) 模拟简化为简单的集合交集计算。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力破解（模拟所有路径）| O(n·m) | O(n·m) | 适用于小 n、m，这里可以接受，但没有必要 |
 | 最优（设置交集）| O(n+m) | O(n+m) | 已接受 |

 ## 算法演练

 1. 对于每个测试用例，读取底部列车的数量`n`并离开火车`m`。 
2. Read the list of scheduled bottom train numbers and store them in a set for fast lookup.
 3. Read the list of scheduled left train numbers and store them in another set.
 4. 计算两个集合的交集。 This gives all train numbers scheduled on both axes that would collide.
 5. The size of the intersection is the minimum number of trains to cancel. 打印这个号码。 

Why it works: every potential collision is represented by a train number appearing in both lists. Canceling one train from each conflicting pair eliminates the collision. Since each train number occurs at most once per side, there is a one-to-one mapping between intersecting train numbers and collisions. 这样就保证了正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def main():
    t = int(input())
    for _ in range(t):
        n, m = map(int, input().split())
        bottom_trains = set(map(int, input().split()))
        left_trains = set(map(int, input().split()))
        collisions = bottom_trains & left_trains
        print(len(collisions))

if __name__ == "__main__":
    main()
```该解决方案首先读取测试用例的数量。 每个测试用例都是通过读取两个列车编号列表来处理的。 将列表转换为集合允许 O(1) 平均成员资格检查和直接计算交集。 使用`&`有效地计算集合交集。 交叉路口的长度给出了所需取消的最少数量。 

## 工作示例

 ### 输入示例 1```
1 2
1
3 4
```| 底部火车 | 左火车 | 交叉口| 结果|
 | ---| ---| ---| ---|
 | {1} | {3,4} | {} | 0 |

 没有共同的火车号码，因此不需要取消。 

### 输入示例 2```
3 2
1 3 4
2 4
```| 底部火车 | 左火车 | 交叉口| 结果|
 | ---| ---| ---| ---|
 | {1,3,4} | {2,4} | {4} | 1 |

 该路口有 4 号列车，可能会相撞。 取消其中一列火车即可解决碰撞问题。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 每个测试用例 O(n + m) | 将列表转换为集合并计算交集与火车总数呈线性 |
 | 空间| 每个测试用例 O(n + m) | 存储火车组 |

 给定约束 (n,m ≤ 100, t ≤ 100)，操作总数最多为 100×(100+100) = 20,000，这对于现代处理器来说是微不足道的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    main()
    return output.getvalue().strip()

# Provided samples
assert run("3\n1 2\n1\n3 4\n3 2\n1 3 4\n2 4\n9 14\n2 7 16 28 33 57 59 86 99\n3 9 14 19 25 26 28 35 41 59 85 87 99 100\n") == "0\n1\n3", "Sample 1"

# Custom test cases
assert run("1\n1 1\n1\n1\n") == "1", "single collision"
assert run("1\n2 2\n1 2\n3 4\n") == "0", "no collision"
assert run("1\n3 3\n1 2 3\n1 2 3\n") == "3", "all collide"
assert run("1\n1 3\n100\n98 99 100\n") == "1", "boundary numbers"
assert run("1\n2 1\n50 60\n60\n") == "1", "one collision in middle"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 1 / 1 / 1 | 1 1 / 1 / 1 | 1 | 单列列车相撞|
 | 2 2 / 1 2 / 3 4 | 2 2 / 1 2 / 3 4 | 0 | 无碰撞案例|
 | 3 3 / 1 2 3 / 1 2 3 | 3 3 / 1 2 3 / 1 2 3 3 | 所有火车相撞|
 | 1 3 / 100 / 98 99 100 | 1 3 / 100 / 98 99 100 1 | 边数碰撞 |
 | 2 1 / 50 60 / 60 | 1 | 中间碰撞|

 ## 边缘情况

 如果底部或左侧列表仅包含一列列车，则该算法仍然有效。 用于输入`1 1 / 1 / 2`，集合是`{1}`和`{2}`，它们的交集为空，输出为0。对于输入`1 1 / 1 / 1`，两组都是`{1}`，交集大小为1，正确识别碰撞。 该算法自然地处理最小和最大的列车编号，无需特殊的大小写。
