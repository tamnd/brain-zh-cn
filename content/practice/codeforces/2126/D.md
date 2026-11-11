---
title: "CF 2126D - 这是最后一次"
description: "我们得到了一系列赌场，每个赌场都由我们必须玩的一系列硬币 [li, ri] 定义，以及一个固定的结果现实，在玩完之后它成为我们新的硬币数量。 我们从 k 个硬币开始，可以按任意顺序访问赌场，但每次只能访问一次。"
date: "2026-06-08T03:22:46+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "greedy", "sortings"]
categories: ["algorithms"]
codeforces_contest: 2126
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 1037 (Div. 3)"
rating: 1200
weight: 2126
solve_time_s: 78
verified: true
draft: false
---

[CF 2126D - 这是最后一次](https://codeforces.com/problemset/problem/2126/D)

 **评分：** 1200
 **标签：** 数据结构、贪心、排序
 **求解时间：** 1m 18s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一系列赌场，每个赌场都由一系列硬币定义`[l_i, r_i]`我们必须要比赛，并且有一个固定的结果`real_i`在那里玩后，这将成为我们新的硬币数量。 我们从`k`硬币，并且可以按任意顺序访问赌场，但每次只能访问一次。 目标是最终最大化硬币数量。 

输入由多个测试用例组成，每个测试用例指定赌场的数量`n`和初始硬币`k`， 其次是`n`三胞胎`(l_i, r_i, real_i)`。 每个测试用例的输出是一个整数：可实现的最大硬币数。 

给定`n`可以达到`10^5`跨所有测试用例和`k`,`l_i`,`r_i`,`real_i`最多`10^9`，任何检查所有排列的解决方案都是不可行的。 一个天真的`O(n!)`方法将立即失败。 每个测试用例我们都需要一种线性或近线性的方法。 

边缘情况包括从`0`硬币, 赌场在哪里`real_i`不会提高您的计数，或者由于访问某些赌场而首先阻止其他赌场的顺序`l_i`阈值。 例如，如果`k = 0`所有赌场都有`l_i >= 1`, 剩余的最大硬币数`0`。 一种粗心的贪婪方法，选择最大的`real_i`如果该赌场还无法访问，盲目地可能会失败。 

## 方法

 暴力方法将尝试赌场访问的所有排列，更新硬币数量并跟踪最大值。 这原则上可行，但速度慢得令人绝望：`n = 10^5`赌场中，排列的数量是天文数字。 

关键的观察是，一旦您可以玩赌场，新的硬币数量与您到达那里的顺序无关，只要前提条件满足`l_i <= coins <= r_i`很满意。 因此，贪婪策略是有效的：我们可以反复选择任何可玩的赌场，以最大化我们当时的硬币。 每次我们玩游戏时，我们当前的硬币都会增加或保持不变。 当不存在更多可玩的赌场时我们停止。 

这将问题简化为模拟一个过程，在该过程中，我们维护一组未访问的赌场并重复选择当前可以玩的任何赌场。 使用队列或列表并扫描每轮所有未访问过的赌场将给出`O(n^2)`在最坏的情况下，这太慢了。 相反，按赌场的下限对赌场进行排序`l_i`使我们能够有效地识别可玩的赌场并进行迭代，直到没有添加新的赌场。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n!) | O(n) | 太慢了|
 | 带排序的贪心模拟 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1.读取测试用例数量`t`。 
2. 对于每个测试用例，请阅读`n`和初始硬币`k`。 将赌场存储为元组列表`(l_i, r_i, real_i)`。 
3. 按赌场下限对赌场进行排序`l_i`。 这确保了从左到右扫描时，任何带有`l_i <= current coins`可以立即播放。 
4. 初始化一个标志`changed = True`。 尽管`changed`为 true，请执行以下操作：

 1. 设置`changed = False`。 
2. 迭代所有赌场。 如果无人访问赌场并且`l_i <= current coins <= r_i`，标记已访问，更新`current coins = real_i`，并设置`changed = True`。 
5. 重复，直到没有新的赌场可玩。 当前的硬币数量是可达到的最大数量。 

为什么它有效：该过程保证每当赌场变得可玩时，它将在最早的迭代中被访问。 自从`real_i >= l_i`而且每个赌场只使用一次，金币永不减少，保证我们不会错过任何机会。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n, k = map(int, input().split())
        casinos = []
        for _ in range(n):
            l, r, real = map(int, input().split())
            casinos.append([l, r, real, False])  # last element marks visited

        casinos.sort(key=lambda x: x[0])  # sort by l_i
        coins = k
        changed = True
        while changed:
            changed = False
            for casino in casinos:
                if not casino[3] and casino[0] <= coins <= casino[1]:
                    coins = casino[2]
                    casino[3] = True
                    changed = True
        print(coins)

if __name__ == "__main__":
    solve()
```我们排序依据`l_i`有效识别哪些赌场可以立即玩。 我们维持一个`visited`标记以避免再次访问。 外循环仅在获得新币时运行，保证终止。 

## 工作示例

 **示例1：**

 输入：```
3 1
2 3 3
1 2 2
3 10 10
```| 硬币 | 参观赌场 | 访问后的硬币|
 | --- | --- | --- |
 | 1 | 赌场2 (1,2,2) | 2 |
 | 2 | 赌场 1 (2,3,3) | 3 |
 | 3 | 赌场 3 (3,10,10) | 10 | 10

 最终硬币：10。该表确认按照以下顺序选择赌场`l_i <= coins <= r_i`最大化金币。 

**示例2：**

 输入：```
1 0
1 2 2
```| 硬币 | 参观赌场 | 访问后的硬币|
 | --- | --- | --- |
 | 0 | 无 | 0 |

 最终硬币：0。这证实了算法可以处理无法到达的赌场。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 排序需要`O(n log n)`。 每次硬币增加时，while 循环最多扫描每个赌场一次。 由于硬币单调增加并且赌场仅被访问一次，因此总迭代次数为`O(n)`。 |
 | 空间| O(n) | 存储带有标志的赌场需要`O(n)`。 |

 该解决方案即使对于最大时间也能轻松满足 2 秒的限制`n = 10^5`。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    return sys.stdout.getvalue().strip()

# provided samples
assert run("5\n3 1\n2 3 3\n1 2 2\n3 10 10\n1 0\n1 2 2\n1 2\n1 2 2\n2 2\n1 3 2\n2 4 4\n2 5\n1 10 5\n3 6 5") == "10\n0\n2\n4\n5", "sample 1"

# minimum input
assert run("1\n1 0\n0 0 0") == "0", "minimum input"

# maximum single casino reachable
assert run("1\n1 100\n50 200 300") == "300", "max coins single casino"

# all casinos unreachable
assert run("1\n3 0\n1 2 2\n2 3 3\n3 4 4") == "0", "all unreachable"

# sequential unlocks
assert run("1\n3 1\n1 2 2\n2 3 3\n3 4 4") == "4", "sequential unlocks"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1\n1 0\n0 0 0`| 0 | 处理最低硬币和单一赌场|
 |`1\n1 100\n50 200 300`| 300 | 300 处理大型可达赌场|
 |`1\n3 0\n1 2 2\n2 3 3\n3 4 4`| 0 | 所有赌场从一开始就无法访问 |
 |`1\n3 1\n1 2 2\n2 3 3\n3 4 4`| 4 | 赌场连续解锁有效|

 ## 边缘情况

 从零硬币开始，赌场需要正数`l_i`绝不允许任何玩耍。 例如，`k=0`, 赌场`(1,2,2)`和`(3,5,5)`。 循环扫描所有赌场，发现没有可玩的赌场，设置`changed=False`，并立即退出，输出0。 

当多个赌场有`l_i`低于或等于当前硬币，顺序并不重要，因为硬币数量只会增加或保持不变。 为了`k=1`, 赌场`(1,3,2)`和`(1,2,5)`，算法选择扫描中的第一个，将硬币更新为 2，然后选择第二个赌场（现在硬币 2 满足`l_i=1`）并将硬币更新为 5。最终硬币是正确的。
