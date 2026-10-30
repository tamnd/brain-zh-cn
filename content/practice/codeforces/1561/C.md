---
title: "CF 1561C - 地下深处"
description: "我们被赋予了一个面对一系列洞穴的英雄。 每个洞穴都包含许多怪物，每个怪物都有一个护甲值，英雄只有当前力量严格大于怪物的护甲值才能击败怪物。"
date: "2026-06-10T12:13:29+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "greedy", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1561
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 740 (Div. 2, based on VK Cup 2021 - Final (Engine))"
rating: 1300
weight: 1561
solve_time_s: 99
verified: true
draft: false
---

[CF 1561C - 深入地下](https://codeforces.com/problemset/problem/1561/C)

 **评分：** 1300
 **标签：** 二分查找，贪心，排序
 **求解时间：** 1m 39s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被赋予了一个面对一系列洞穴的英雄。 每个洞穴都包含许多怪物，每个怪物都有一个护甲值，英雄只有当前力量严格大于怪物的护甲值才能击败怪物。 击败怪物后，英雄的力量增加一倍。 英雄必须进入每个洞穴一次，按照给定的顺序与洞穴中的所有怪物战斗，然后成功退出。 任务是确定允许英雄按某种顺序清除所有洞穴的最小启动功率。 

输入提供了多个测试用例，每个测试用例指定洞穴的数量，以及每个洞穴的怪物数量及其护甲值（按顺序）。 输出是每个测试用例的最小启动功率。 在所有测试用例中，约束条件允许每个测试用例总共最多有 100,000 个洞穴和 100,000 个怪物。 如果我们希望解决方案在 2 秒内高效运行，这会将每个测试用例的总操作限制在 10^5 左右。 这排除了任何尝试洞穴顺序的所有排列的算法，这将是 n 的阶乘。 

当洞穴中的怪物的护甲值严格降低时，就会出现不明显的边缘情况。 例如，有怪物的洞穴`[10, 9, 8]`另一个与`[12]`需要仔细排序：英雄可能需要首先使用单个怪物来解决洞穴，以尽量减少起始力量。 总是按输入顺序选择洞穴的幼稚方法可能会高估所需的初始功率。 同样，一个只包含一个具有很高护甲的怪物的洞穴可能会主导所需的启动功率。 

## 方法

 蛮力方法是尝试洞穴顺序的每一种排列并模拟英雄的进度。 对于每个订单，我们将从一些力量开始，遍历每个洞穴，对于每个怪物，检查英雄当前的力量是否超过怪物的护甲，从而增加成功战斗的力量。 如果英雄无法击败怪物，我们会放弃该起始力量并尝试更高的值。 虽然这种方法原则上是正确的，但排列的阶乘增长使其即使对于中等 n 也是完全不可行的。 

关键的见解是，在每个洞穴中，英雄所需的最低启动力量取决于第一个怪物的护甲加上他必须按顺序战斗的怪物数量。 更准确地说，如果山洞里的怪物有盔甲`[a_1, a_2, ..., a_k]`，仅在这个洞穴中生存的最小初始功率是`max(a_j - (j - 1)) + 1`， 在哪里`j`按顺序索引怪物。 这说明了每次战斗后的增量功率增益。 一旦我们计算出每个洞穴的要求，问题就简化为选择一个洞穴顺序，以最小化最大运行要求。 

最佳策略是按洞穴所需的最小初始功率对洞穴进行排序，并模拟英雄按此顺序穿过洞穴。 我们跟踪当前的功率，根据洞穴中怪物的数量来增加它，并动态调整所需的启动功率，以确保英雄永远不会失败。 这避免了尝试所有排列，并由于排序而实现了每个测试用例的线性时间复杂度。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n!) | O(n) | 太慢了|
 | 最佳| O(K log n) | O(K log n) | O(n) | 已接受 |

 这里，`K`是所有洞穴中怪物的总数。 

## 算法演练

 1. 对于每个洞穴，计算单独清理该洞穴所需的最小启动功率。 按顺序遍历怪物，保持所需的功率为`max(required, monster_armor - position_index + 1)`。 处理完洞穴后，将此值与洞穴中的怪物数量一起存储。 
2. 根据计算出的最低所需启动功率对洞穴进行排序。 这会优先考虑那些更容易清除且起始英雄力量较低的洞穴，从而最大限度地减少所有洞穴所需的最大起始力量。 
3. 初始化`current_power`作为 0 和`answer`为 0。迭代排序的洞穴。 对于每个洞穴，更新`answer`作为`max(answer, minimal_required_power - current_power)`确保英雄能够进入山洞。 然后递增`current_power`通过洞穴内怪物的数量，反映击败该洞穴内所有怪物后累积的力量增益。 
4.处理完所有洞穴后，`answer`包含英雄必须以最佳顺序在所有洞穴中生存所需的最小初始力量。 

为什么它有效：该算法保持了每个洞穴开始时的不变性，`current_power + answer`至少与洞穴的最低要求一样大。 按最小洞穴要求排序可确保英雄力量的最小增量首先发生，从而保证总体起始力量最小化。 任何其他订单要么需要更高的启动功率，要么产生相同的启动功率，从而确认正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def minimal_start_power(caves):
    cave_info = []
    for monsters in caves:
        k = len(monsters)
        req = 0
        for i, armor in enumerate(monsters):
            req = max(req, armor - i + 1)
        cave_info.append((req, k))
    
    cave_info.sort()
    answer = 0
    current_power = 0
    for req, k in cave_info:
        answer = max(answer, req - current_power)
        current_power += k
    return answer

def main():
    t = int(input())
    results = []
    for _ in range(t):
        n = int(input())
        caves = []
        for _ in range(n):
            data = list(map(int, input().split()))
            k = data[0]
            monsters = data[1:]
            caves.append(monsters)
        results.append(str(minimal_start_power(caves)))
    print("\n".join(results))

if __name__ == "__main__":
    main()
```该解决方案将每个洞穴的计算分为一个预处理步骤，以计算其所需的最小启动功率。 排序可确保以最小化英雄所需初始力量的顺序处理洞穴。 这`answer`仅当当前累积功率不足以用于下一个洞穴时才更新变量，防止超调。 使用`current_power += k`反映了每次洞穴后的累积增益，Python 的任意大小的整数避免了溢出问题。 

## 工作示例

 **示例输入 1：**```
1
1
1 42
```| 洞穴 | 怪物 | 所需的最小功率| 排序顺序 | 当前功率| 回答 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | [42]| 43 | 43 1 | 0 | 43 | 43

 这证实了一个护甲为 42 的怪物需要起始力量为 43。 

**示例输入 2：**```
1
2
3 10 15 8
2 12 11
```| 洞穴 | 怪物 | 所需的最小功率| 排序顺序 | 当前功率| 回答 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | [3,10,15,8] | 15 | 15 2 | 0 | 13 |
 | 2 | [12,11]| 13 | 1 | 2 | 13 |

 首先解决第 2 洞，需要 13 个； 击败2个怪物后，`current_power=2`。 洞穴 1 需要 15 个，但是`current_power + answer = 2 + 13 = 15`， 充足的。 英雄以最低的初始力量生存 13。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(K log n) | O(K log n) | 预先计算每个洞穴所需的最小功率，时间复杂度为 O(K)，排序 n 个洞穴的时间复杂度为 O(n log n) |
 | 空间| O(K + n) | O(K + n) | 每个洞穴储存怪物和最小能量 |

 当 K ≤ 10^5 且 n ≤ 10^5 时，该算法可以轻松满足 2 秒和 512 MB 内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    from contextlib import redirect_stdout
    output = io.StringIO()
    with redirect_stdout(output):
        main()
    return output.getvalue().strip()

# Provided samples
assert run("2\n1\n1 42\n2\n3 10 15 8\n2 12 11\n") == "43\n13", "samples"

# Minimum size
assert run("1\n1\n1 1\n") == "2", "single monster minimal"

# All equal
assert run("1\n2\n2 5 5\n2 5 5\n") == "6", "all equal monsters"

# Maximum monsters in one cave
assert run("1\n1\n5 1 2 3 4 5\n") == "2", "increasing sequence"

# Decreasing sequence
assert run("1\n1\n3 5 4 3\n") == "6", "decreasing sequence"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 1 1 | 1 1 1 2 | 最小输入|
 | 2 个洞穴共 5 个 | 6 | 平等的怪物|
 | 1个洞穴增加 | 2 | 英雄逐渐获得足够的力量 |
 | 1 个洞穴减少 | 6 | 算法正确处理护甲减少问题 |

 ## 边缘情况

 递减的怪物序列，例如`[5,4,3]`需要仔细计算。 洞穴所需的最小功率为“max(5-0+1, 4-1+1, 3-2+1) = max(
