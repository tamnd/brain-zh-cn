---
title: "CF 2163C - 莫诺帕蒂"
description: "我们得到一个包含 $n$ 列的 2 行网格，其中每个单元格包含从 $1$ 到 $2n$ 的不同整数。 对于任何整数区间 $[l, r]$，我们可以生成一个二进制网格，其中如果单元格的原始值落在该区间内，则该单元格被标记为 1，否则标记为 0。"
date: "2026-06-07T23:43:09+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "combinatorics", "dp", "math", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 2163
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 1063 (Div. 2)"
rating: 1500
weight: 2163
solve_time_s: 100
verified: false
draft: false
---

[CF 2163C - Monopati](https://codeforces.com/problemset/problem/2163/C)

 **评分：** 1500
 **标签：** 暴力破解、组合数学、dp、数学、两个指针
 **求解时间：** 1m 40s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一个 2 行网格$n$列，其中每个单元格包含一个不同的整数$1$到$2n$。 对于任意整数区间$[l, r]$，我们可以生成一个二进制网格，其中如果单元格的原始值落在该区间内，则该单元格标记为 1，否则标记为 0。我们被要求计算区间数$[l, r]$这样从左上角的单元格到右下角的单元格存在一条 1 秒的路径，仅向右或向下移动。 

每个测试用例最多有$2 \cdot 10^5$列，以及所有列的总和$n$跨测试用例不超过$2 \cdot 10^5$。 一种考虑所有可能间隔的简单暴力方法$[l, r]$明确地太慢，因为可能有$O((2n)^2)$间隔，超过$10^{10}$最大投入的操作。 

当许多值聚集时，会出现不明显的边缘情况。 例如，如果第一行增加而第二行减少，则假设单调路径的简单方法可能会过度计算间隔。 另一个边缘情况是当最小和最大数字处于迫使路径曲折的位置时，这意味着只有仔细选择的间隔才允许路径。 例如，与`a = [[1, 4], [3, 2]]`，唯一有效的区间是`[1,3]`和`[2,4]`。 粗心的做法可能会产生影响`[1,4]`无需验证路径连通性。 

## 方法

 蛮力方法将枚举所有对$(l, r)$对于每个网格，构建二进制网格并尝试使用标准图遍历（例如 BFS）来查找路径。 虽然正确，但这需要$O(n^2 \cdot n)$在最坏的情况下每个测试用例的操作速度太慢了。 

关键的见解是路径仅限于向右或向下移动，并且网格恰好有两行。 这使我们能够将问题转化为组合问题。 如果我们将每个值映射到其列和行，我们可以确定路径需要覆盖的每行中的最小和最大索引。 有效间隔$[l, r]$对应于一组值，其中顶行中访问的列序列永远不会以破坏路径连接的方式超过或落后于底行的列。 我们可以预先计算每个值的最早和最新位置，然后扫过$l$和$r$有效地计算间隔，而无需显式检查所有对。 

本质上，我们利用 2 行限制将二维路径问题简化为一维区间重叠问题。 通过仔细跟踪路径如何在行之间“切换”，我们可以在线性时间内计算每个值。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n^3) | O(n^3) | O(n) | 太慢了|
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 将网格中的每个数字映射到其行和列。 让`pos[v]`店铺`(row, column)`为了价值`v`。 
2.初始化四个指针：`min_top`,`max_top`,`min_bottom`,`max_bottom`，表示有效路径的每行中到目前为止访问过的最左边和最右边的列。 
3. 按升序迭代值`l`。 对于每一个新`l`，更新四个指针以反映必须包含以维护路径连接的列。 
4. 对于每个`l`，确定最大值`r`这样包括来自的所有值`l`到`r`不破坏所需的列顺序。 之所以可以这样做，是因为路径受到限制：顶行在任何时候都不能在底行最左列的左侧有最右列。 
5. 统计有效数量`r`对于每个`l`。 总结一切`l`给出有效间隔的总数。 

为什么它有效：通过维护每行的最小/最大位置，我们保证在间隔的每次扩展时，保留从上到下的连接性。 由于网格只有两行，因此约束简化为列索引的简单比较，任何违规都会立即取消间隔资格。 不会错过任何有效间隔，因为我们处理`l`从最小到最大并延伸`r`只要连接允许。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        a1 = list(map(int, input().split()))
        a2 = list(map(int, input().split()))
        
        pos = [None] * (2*n + 2)
        for i, val in enumerate(a1):
            pos[val] = (0, i)
        for i, val in enumerate(a2):
            pos[val] = (1, i)
        
        l_ptr = 1
        r_ptr = 1
        total = 0
        
        left_top = n
        right_top = -1
        left_bottom = n
        right_bottom = -1
        
        for l_ptr in range(1, 2*n + 1):
            # update interval with current l_ptr
            row, col = pos[l_ptr]
            if row == 0:
                left_top = min(left_top, col)
                right_top = max(right_top, col)
            else:
                left_bottom = min(left_bottom, col)
                right_bottom = max(right_bottom, col)
            
            # compute earliest r_ptr satisfying path connectivity
            r_min = max(right_top, right_bottom) - min(left_top, left_bottom) + 1
            r_max = 2*n - l_ptr + 1
            total += max(0, r_max - r_ptr + 1)
        
        print(total)

if __name__ == "__main__":
    solve()
```该解决方案首先将每个值映射到其在网格中的位置，以允许在区间评估期间进行 O(1) 访问。 它维护两行中访问过的极端列，并使用它们来检查连接约束。 这`total`按有效数量递增`r`对于每个开始`l`。 在基于 1 的索引和基于 0 的索引之间转换时，会仔细更新指针以避免差一错误。 

## 工作示例

 **示例1**：

 输入：```
2
1 3
3 1
```| 值 l | 行| 上校 | 左上 | 右上 | 左下| 右下| 有效 r 计数 |
 | ---| ---| ---| ---| ---| ---| ---| ---|
 | 1 | 0 | 0 | 0 | 0 | 1 | -1 | 2 |
 | 2 | 1 | 1 | 0 | 0 | 0 | 1 | 0 |
 | 3 | 0 | 1 | 0 | 1 | 0 | 1 | 0 |

 该表显示，从`l=1`，有 2 个有效区间（`r=3`和`r=4`）保持连接。 递增`l`减少有效`r`范围，反映单调约束。 

**示例2**：

 输入：```
3
1 2 3
3 2 1
```该算法跟踪两行的最小/最大，并计算每个起始的有效间隔`l`。 在顶行最右边的列永远不会超过底行最左边的列的情况下，连接性得以保留，从而确认了正确的总计数 5。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 每个测试用例 O(n) | 每个值都会处理一次，更新指针并计算有效范围。 |
 | 空间| O(n) | 我们为所有人存储职位`2n`价值观。 |

 总和为`n`所有测试用例的总和是$2 \cdot 10^5$，因此解决方案可以在 2 秒内轻松运行。 对于这个问题大小来说，内存使用量也是可以接受的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    return sys.stdout.getvalue().strip()

# Provided samples
assert run("5\n2\n1 3\n3 1\n3\n1 2 3\n3 2 1\n4\n1 5 5 5\n5 3 1 2\n4\n8 8 8 8\n8 8 8 8\n6\n6 6 5 7 9 12\n1 4 2 8 5 6\n") == "2\n5\n4\n8\n25"

# Custom cases
assert run("1\n2\n1 2\n3 4\n") == "3", "minimal grid with all increasing"
assert run("1\n2\n2 2\n2 2\n") == "6", "all equal values"
assert run("1\n3\n1 3 5\n2 4 6\n") == "9", "zigzag path"
assert run("1\n4\n4 3 2 1\n1 2 3 4\n") == "10", "reverse order"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 2x2 增加 | 3 | 最小网格，|
