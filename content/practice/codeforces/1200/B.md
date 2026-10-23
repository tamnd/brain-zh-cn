---
title: "CF 1200B - 方块冒险"
description: "在《方块冒险》中，我们有一排不同高度的柱子。 玩家从第一列开始，必须到达最后一列。"
date: "2026-06-11T23:53:21+07:00"
tags: ["codeforces", "competitive-programming", "dp", "greedy"]
categories: ["algorithms"]
codeforces_contest: 1200
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 578 (Div. 2)"
rating: 1200
weight: 1200
solve_time_s: 110
verified: true
draft: false
---

[CF 1200B - 方块冒险](https://codeforces.com/problemset/problem/1200/B)

 **评分：** 1200
 **标签：** dp、贪婪
 **求解时间：** 1m 50s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 在《方块冒险》中，我们有一排不同高度的柱子。 玩家从第一列开始，必须到达最后一列。 角色可以在袋子中携带方块，并通过从当前列中移除方块或将袋子中的方块放置到其上来修改列高度。 仅当高度差不超过给定限制时才可能移动到下一列，`k`。 目标是确定玩家是否可以在这些规则下从第一列遍历到最后一列。 

输入给出列数、包中的初始块数、容差`k`，以及一个列高数组。 如果玩家可以到达最后一列，则输出为“YES”，否则输出为“NO”。 

约束表明`n`最多 100，这个值足够小，可以在一个简单的循环中处理每一列。 袋子和立柱的高度可达$10^6$，这意味着我们无法模拟所有可能的块传输。 相反，我们需要一种贪婪的方法，随着我们的前进动态更新包中的块数量。 例如，粗心的方法可能会尝试模拟块的每种可能的重新排列，或者在以下情况下失败：`k=0`或者玩家有足够的方块来跳跃。 

当一列已经低于下一列，但袋子没有足够的块来填充间隙时，就会出现边缘情况。 例如，与`h = [3, 7]`,`m = 3`， 和`k = 0`，我们无法到达下一列，因为间隙超出了容差，并且使用包中的所有块仍然会留下赤字。 一个天真的检查`|h_i - h_{i+1}| <= k`会错误地暗示在不考虑可以添加的块的情况下不可能进行移动。 

## 方法

 暴力方法将模拟在每列添加或删除块的每种可能的组合，跟踪袋子中的内容。 虽然这是正确的，但它会组合爆炸，因为在每一列我们都可以添加或删除多个块，从而创建大量状态。 和`n=100`和`m`可能高达$10^6$，操作次数变得完全不切实际。 

关键的观察是我们不需要模拟每个动作。 每一步唯一重要的是我们能否在公差范围内满足下一列的高度`k`。 如果当前的列比需要的高，我们将多余的块移入袋子中。 如果较短，我们使用袋子中的块来达到最小允许高度。 这种贪婪方法之所以有效，是因为包的容量是无限的，我们只关心到达下一列，而不关心添加/删除操作的确切顺序。 

我们动态维护包中的块数，并检查每次转换是否可以到达下一列。 这将问题简化为通过列的线性扫描。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 指数为`n`| O(n + m) | 太慢了 |
 | 贪婪/最优| 每个测试用例 O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取测试用例的数量。 对于每个测试用例，请阅读`n`,`m`,`k`，以及列高数组`h`。 
2. 初始化包中的块数为`m`。 
3. 从第一列到倒数第二列循环。 对于每一列`i`，计算我们可以安全地离开柱子的最大高度`i`以便移动到列`i+1`是可能的。 这是`max(0, h[i+1] - k)`。 
4.如果`h[i]`大于或等于所需的最小高度，请将多余的块添加到袋子中。 多余的部分是`h[i] - min_required`。 
5.如果`h[i]`小于所需的最小高度，计算我们需要从袋子中取出多少块。 如果袋子中的方块少于所需的方块，则无法移动； 中断并返回“NO”。 否则，从包中减去所需的块。 
6. 处理完所有转换后，如果我们从未用完块，则打印“YES”。 

为什么有效：在每一步中，我们都会确保柱高度在下一步移动的公差范围内。 通过贪婪地使用或收集块，我们保持了一个不变量，即包始终包含前一列中可用的剩余块。 这保证了如果我们不能满足当前包的列，则无法进一步进行。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n, m, k = map(int, input().split())
    h = list(map(int, input().split()))
    bag = m
    possible = True
    for i in range(n - 1):
        min_required = max(0, h[i+1] - k)
        if h[i] >= min_required:
            bag += h[i] - min_required
        else:
            need = min_required - h[i]
            if bag < need:
                possible = False
                break
            bag -= need
    print("YES" if possible else "NO")
```这段代码遵循贪心策略。 我们计算前进所需的最小高度并相应地调整袋子。 这`max(0, h[i+1] - k)`确保我们永远不会尝试留下负高度。 当袋子无法弥补不足时，循环立即停止，从而节省不必要的计算。 

## 工作示例

 **示例1**：

 输入：`3 0 1`和高度`4 3 5`。 

| 我| h[i]| h[i+1] | h[i+1] 最低要求 | 包| 行动|
 | --- | --- | --- | --- | --- | --- |
 | 0 | 4 | 3 | 2 | 0 | 4 >= 2 → 袋子 += 2 → 袋子 = 2 |
 | 1 | 3 | 5 | 4 | 2 | 3 < 4 → 需要 = 1 → 袋子 -= 1 → 袋子 = 1 |

 循环结束并且`bag >= 0`，所以输出为“YES”。 

**示例2**：

 输入：`3 1 2`和高度`1 4 7`。 

| 我| h[i]| h[i+1] | h[i+1] 最低要求 | 包| 行动|
 | --- | --- | --- | --- | --- | --- |
 | 0 | 1 | 4 | 2 | 1 | 1 < 2 → 需要 = 1 → 包 = 0 |
 | 1 | 4 | 7 | 5 | 0 | 4 < 5 → need = 1 → bag < need → impossible |

 输出为“否”。 

These traces show the algorithm maintains the bag invariant and correctly determines reachability.

 ## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n * t) | We process each column exactly once per test case |
 | 空间| O(n) | We store the column heights array for each test case |

 给定`n ≤ 100`和`t ≤ 1000`，总操作次数最多为 100,000 次，完全在 1 秒限制之内。 袋子和高度的计算都是整数运算，因此不会出现性能瓶颈。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = []
    t = int(input())
    for _ in range(t):
        n, m, k = map(int, input().split())
        h = list(map(int, input().split()))
        bag = m
        possible = True
        for i in range(n - 1):
            min_required = max(0, h[i+1] - k)
            if h[i] >= min_required:
                bag += h[i] - min_required
            else:
                need = min_required - h[i]
                if bag < need:
                    possible = False
                    break
                bag -= need
        output.append("YES" if possible else "NO")
    return "\n".join(output)

# provided samples
assert run("5\n3 0 1\n4 3 5\n3 1 2\n1 4 7\n4 10 0\n10 20 10 20\n2 5 5\n0 11\n1 9 9\n99\n") == "YES\nNO\nYES\nNO\nYES"

# custom cases
assert run("1\n1 0 0\n0\n") == "YES", "single column"
assert run("1\n2 0 0\n5 5\n") == "YES", "exactly equal columns, k=0"
assert run("1\n2 1 0\n5 6\n") == "YES", "need one block from bag"
assert run("1\n2 0 0\n5 6\n") == "NO", "cannot reach next column"
assert run("1\n3 1000000 1000000\n1000000 0 1000000\n") == "YES", "large numbers"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1\n1 0 0\n0\n`| 是 | 单列边缘情况 |
 |`1\n2 0 0\n5 5\n`| 是 | 等高，k=0 |
 | `1\n2 1 0\n5 6 | | |
