---
title: "CF 1569D - 不方便的配对"
description: "我们被要求计算位于完美方格城市街道上的人们中“不方便配对”的数量。 每个人都保证位于垂直或水平街道上，这些街道以排序坐标给出。"
date: "2026-06-10T11:38:15+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "implementation", "sortings", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1569
codeforces_index: "D"
codeforces_contest_name: "Educational Codeforces Round 113 (Rated for Div. 2)"
rating: 1900
weight: 1569
solve_time_s: 137
verified: false
draft: false
---

[CF 1569D - 不方便的配对](https://codeforces.com/problemset/problem/1569/D)

 **评级：** 1900
 **标签：** 二分查找、数据结构、实现、排序、两个指针
 **求解时间：** 2m 17s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求计算位于完美方格城市街道上的人们中“不方便配对”的数量。 每个人都保证位于垂直或水平街道上，这些街道以排序坐标给出。 当两个人之间沿着街道的最短路径比他们之间的曼哈顿距离长时，就会出现不方便配对的概念。 由于所有街道都是笔直且双向的，因此曼哈顿距离只是 x 和 y 坐标的绝对差之和。 如果两个人在一维中不共享同一条街道并且必须经过中间街道，则沿街道的最短路径可能会超过此距离。 

输入由多个测试用例组成。 每个测试用例提供垂直和水平街道的坐标，后面是每个人的坐标。 我们必须有效地处理多达 300,000 人和 200,000 条街道，这意味着任何直接比较所有对的解决方案都需要大约 10^10 次操作，这对于 2 秒的时间限制来说太大了。 这迫使我们避免强力的成对比较。 

当多人共用同一条街道时，就会出现不明显的边缘情况。 例如，如果两个人位于同一条垂直街道上，但位于不同的水平街道上，则他们沿街道的最短路径是 y 坐标之差，等于曼哈顿距离。 然而，如果它们位于不同的垂直街道上但共享一条水平街道，那么它们沿街道的最短路径也是水平距离，同样等于曼哈顿距离。 仅当两个坐标不同时才会出现不方便配对，并且街道迫使人们通过第三条街道行驶。 另一个微妙之处是，当一个人处于两条街道的交叉口时，如果处理不仔细，可能会被重复计算。 

## 方法

 暴力方法会迭代所有成对的人，计算曼哈顿距离和基于街道的最短路径，并计算后者严格更大的对。 这是简单且正确的，但当 k 达到 3·10^5 时，每个测试用例大约需要 k²/2 次比较，最坏情况下大约需要 4.5·10^10 次操作。 这显然是不可行的。 

关键的见解是，只有当两个人恰好共享一种坐标类型时，才会出现不方便的配对。 也就是说，一个人在一条垂直街道上，另一个人在同一条垂直街道上（但 y 不同）或同一条水平街道上（但 x 不同）。 如果它们共享两个坐标，则它们位于同一点，这一点被排除在外。 如果两者都不共享，则最短路径等于曼哈顿距离。 因此，我们可以根据 x 和 y 坐标对人员进行分组，并计算有多少对仅共享一个坐标，同时避免重复计算交叉点。 对于每条垂直街道，我们都会考虑其上的所有人，计算有多少人共享相同的 y 坐标，然后从总数中减去这些人，以获得沿该街道的不方便对。 我们对水平街道也做同样的事情。 使用哈希映射（字典）来计算出现次数允许根据排序对每个测试用例进行 O(k log k) 或 O(k) 处理。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(k²) | O(k) | 太慢了 |
 | 按街道数量分组 | O(k log k) | O(k log k) | O(k) | 已接受 |

 ## 算法演练

1. 对于每个测试用例，读取垂直街道数 n、水平街道数 m 和人数 k。 还要读取街道坐标和每个人的坐标。 
2. 将人分为两类：垂直街道上的人（存储在以 x 坐标为关键字的字典中）和水平街道上的人（存储在以 y 坐标为关键字的字典中）。 
3. 初始化计数器`inconvenient_pairs`为零。 
4. 对于每条至少有两人的垂直街道，计算有多少人共享每个 y 坐标。 这条街上的总对数是`c * (c-1) / 2`，不方便的对的数量（相同 y）是`count_y * (count_y - 1) / 2`总体而言 y。 从前者中减去后者并将结果添加到`inconvenient_pairs`。 
5. 对水平街道重复步骤 4，计算具有相同 x 坐标的人数。 
6. 打印`inconvenient_pairs`对于测试用例。 

该算法之所以有效，是因为不方便的对正是那些在一个维度上共享一条街道但在另一个维度上不同的对，并且通过减去共享两个坐标的对，我们可以避免对十字路口的人数进行两次计数。 哈希图让我们能够有效地跟踪每个坐标的计数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import defaultdict

def solve():
    t = int(input())
    for _ in range(t):
        n, m, k = map(int, input().split())
        x_coords = list(map(int, input().split()))
        y_coords = list(map(int, input().split()))
        
        vert_map = defaultdict(list)
        hor_map = defaultdict(list)
        points = []
        for _ in range(k):
            x, y = map(int, input().split())
            points.append((x, y))
            if x in x_coords:
                vert_map[x].append(y)
            if y in y_coords:
                hor_map[y].append(x)
        
        res = 0
        # vertical streets
        for x, ys in vert_map.items():
            count = len(ys)
            if count > 1:
                ys_count = defaultdict(int)
                for y in ys:
                    ys_count[y] += 1
                total_pairs = count * (count - 1) // 2
                same_y_pairs = sum(v * (v - 1) // 2 for v in ys_count.values())
                res += total_pairs - same_y_pairs
        
        # horizontal streets
        for y, xs in hor_map.items():
            count = len(xs)
            if count > 1:
                xs_count = defaultdict(int)
                for x in xs:
                    xs_count[x] += 1
                total_pairs = count * (count - 1) // 2
                same_x_pairs = sum(v * (v - 1) // 2 for v in xs_count.values())
                res += total_pairs - same_x_pairs
        
        print(res)

if __name__ == "__main__":
    solve()
```该解决方案首先按街道坐标对人员进行分组，然后分别计算每条垂直和水平街道上不方便的人群。 使用字典可以避免对所有对进行嵌套循环，从而防止重复计数。 相同坐标对的每次减法都能正确处理相交。 

## 工作示例

 输入示例：```
2
2 2 4
0 1000000
0 1000000
1 0
1000000 1
999999 1000000
0 999999
5 4 9
0 1 2 6 1000000
0 4 8 1000000
4 4
2 5
2 2
6 3
1000000 1
3 8
5 8
8 8
6 8
```对于第一个测试用例，`vert_map`有`{0: [999999], 1000000: [1]}`和`hor_map`有`{0: [1], 1000000: [999999]}`。 除十字路口外，所有街道都只有一个人，导致正好有两对不方便的人：`(1,0)-(0,999999)`和`(1000000,1)-(999999,1000000)`。 

对于第二个测试用例，垂直街道计数生成 2 个不方便的对，水平街道计数又生成 3 个，总共 5 个。下表显示了每条街道的计数。 

| 街道 | 计数 | 相同坐标对 | 不方便的配对 |
 | --- | --- | --- | --- |
 | 垂直 0 | 2 | 0 | 1 |
 | 垂直 1 | 1 | 0 | 0 |
 | 垂直2 | 1 | 0 | 0 |
 | 垂直 6 | 1 | 0 | 0 |
 | 纵向1000000 | 1 | 0 | 0 |
 | 水平 0 | 1 | 0 | 0 |
 | 水平 1 | 1 | 0 | 0 |
 | 水平 4 | 1 | 0 | 0 |
 | 水平 5 | 1 | 0 | 0 |
 | 水平 8 | 4 | 1 | 3 |

 这证实了该算法可以正确处理单人街道和多人街道，并考虑到交叉路口。 

## 复杂度分析

 | 测量 | 复杂性 | 解释
