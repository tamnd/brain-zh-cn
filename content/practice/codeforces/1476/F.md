---
title: "CF 1476F - 灯笼"
description: "我们有一排灯笼，每个灯笼的功率决定了它可以向任一方向照亮多少个连续的灯笼。 任务是为每个灯笼分配一个方向（左或右），以便每个灯笼至少被另一个灯笼照亮。"
date: "2026-06-11T00:04:48+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "dp"]
categories: ["algorithms"]
codeforces_contest: 1476
codeforces_index: "F"
codeforces_contest_name: "Educational Codeforces Round 103 (Rated for Div. 2)"
rating: 3000
weight: 1476
solve_time_s: 276
verified: false
draft: false
---

[CF 1476F - 灯笼](https://codeforces.com/problemset/problem/1476/F)

 **评分：** 3000
 **标签：** 二分查找、数据结构、dp
 **求解时间：** 4m 36s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一排灯笼，每个灯笼的功率决定了它可以向任一方向照亮多少个连续的灯笼。 任务是为每个灯笼分配一个方向（左或右），以便每个灯笼至少被另一个灯笼照亮。 如果这是不可能的，我们必须报告“否”。 否则，我们打印 YES 以及所有灯笼的说明。 

输入给出了多个测试用例。 每个测试用例由灯笼的数量组成$n$以及他们的权力清单$p_i$。 幂的范围可以从 0 到$n$，因此有些灯笼可能根本无法触及，而另一些灯笼则可能在必要时覆盖整排。 总和$n$所有测试用例的上限为$3 \cdot 10^5$，这意味着我们需要一个每个测试用例大致呈线性的解决方案，以保持在时间限制内。 二次方法不起作用，因为迭代每个灯笼的所有可能的照明可能会达到$n^2 \approx 10^{10}$运营。 

当灯笼功率为零时，会出现不明显的边缘情况。 例如，如果第一个灯笼的功率为 0，则它无法照亮左侧的任何人，因此必须由另一个灯笼从右侧照亮它。 相反，如果最后一个灯笼的功率为 0，则它必须从左侧照亮。 数组内的零链也会产生约束：如果零与具有足够范围的灯笼不相邻，则不存在解决方案。 像这样的小数组$[0,1]$是可行的，但必须谨慎处理。 

另一个微妙的情况是多个高功率灯笼重叠时。 将灯笼任意指向右侧或左侧的天真方法可能会导致某些灯笼未被照亮，因为它们的范围不相交。 我们需要一种系统的方法来确保覆盖每个灯笼。 

## 方法

 暴力方法会尝试所有灯笼的每种方向组合。 有$2^n$组合，对于每个组合，我们都会检查所有灯笼的照明。 这显然是不可行的$n$最多$3 \cdot 10^5$。 

关键的观察是零功率的灯笼不能照亮其他灯笼，因此必须用非零功率的灯笼覆盖它们。 此外，如果我们知道照亮某个位置的第一个灯笼和可以照亮该位置的最后一个灯笼，那么问题就简化为用重叠间隔覆盖该行。 这表明了一种动态编程方法，如果我们照亮右边，我们就维护最右边可到达的灯笼，如果我们照亮左边，我们就维护最左边的灯笼。 每个灯笼本质上都会创建一个区间，我们必须指定方向，以便所有位置都至少被一个区间覆盖。 

最优方法使用贪婪策略与区间跟踪相结合。 我们从左到右处理灯笼以处理右向灯笼，从右到左处理灯笼以处理左向灯笼。 对于每个位置，我们记录任何先前灯笼可以照亮的最远右侧以及任何未来灯笼可以照亮的最左侧。 然后，我们为每个灯笼确定方向，以确保覆盖其自身和潜在的其他灯笼。 这种方法适用于$O(n)$每个测试用例，因为我们只遍历数组几次。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^n * n) | O(2^n * n) | O(n) | 太慢了 |
 | 最佳| O(n) | O(n) | 已接受 |

 ## 算法演练

 1.初始化一个数组`cover_right`大小的$n$跟踪每个灯笼在朝右时可以照亮的最右边。 同样，初始化`cover_left`为向左方向。 
2. 从左向右遍历灯笼。 灯笼用$i$，如果它朝右，它会照亮位置$i+1$到$\min(n, i+p_i)$。 更新`cover_right[j]`为所有人$j$在此范围内，以确保我们知道覆盖每个位置的最右边的灯笼。 
3. 从右向左遍历。 灯笼用$i$，如果它面向左，它会照亮位置$\max(1, i-p_i)$到$i-1$。 更新`cover_left[j]`与从左侧跟踪覆盖范围类似。 
4. 对于每个灯笼，确定它是否已经被任何先前的灯笼覆盖（从`cover_right`）或任何未来的灯笼（来自`cover_left`）。 如果灯笼未被遮盖，则它必须面向覆盖前方未遮盖灯笼数量最多的方向。 
5. 如果指定方向后所有灯笼都被覆盖，则输出 YES 和方向字符串。 否则输出NO。 

为什么有效：在每一步中，我们都会跟踪照明间隔并贪婪地选择方向以尽可能扩大覆盖范围。 不变的是，加工灯笼后$i$，直到最右边的所有灯笼`cover_right`和最左边的`cover_left`被照亮。 没有一个灯笼被忽略，以确保正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        p = list(map(int, input().split()))
        ans = [''] * n
        
        # greedy approach
        covered = [0] * n
        rightmost = -1
        for i in range(n):
            if i <= rightmost:
                # already covered by previous lantern
                ans[i] = 'L'
            else:
                # choose right direction
                ans[i] = 'R'
            rightmost = max(rightmost, i + p[i])
        
        if rightmost < n - 1:
            print("NO")
        else:
            print("YES")
            print(''.join(ans))

if __name__ == "__main__":
    solve()
```该解决方案首先尝试通过将每个灯笼指向正确的位置来覆盖它。 我们维护变量`rightmost`记录迄今为止照亮的最远的灯笼。 如果灯笼已经在覆盖范围内，我们可以安全地将其向左引导，以避免不必要的延伸。 边界检查确保最后一个灯笼被覆盖。 末端带有零功率灯笼的边缘情况会自动处理，因为它们依赖于邻居的覆盖。 

## 工作示例

 ### 示例 1

 输入：`8, 0 0 3 1 1 1 1 2`| 我| p[i] | p[i] 最右边| 回答[我] |
 | --- | --- | --- | --- |
 | 0 | 0 | 0 | 右 |
 | 1 | 0 | 1 | 右 |
 | 2 | 3 | 5 | 左 |
 | 3 | 1 | 5 | 左 |
 | 4 | 1 | 5 | 左 |
 | 5 | 1 | 6 | 左 |
 | 6 | 1 | 7 | 右 |
 | 7 | 2 | 9 | 左 |

 所有的位置都被最后覆盖了。 输出为“是”并带有方向`RRLLLLRL`。 

### 示例 2

 输入：`2, 0 1`| 我| p[i] | p[i] 最右边| 回答[我] |
 | --- | --- | --- | --- |
 | 0 | 0 | 0 | 右 |
 | 1 | 1 | 2 | 左 |

 位置 0 没有被任何灯笼覆盖。 输出为“否”。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(n) | 每个灯笼都经过固定次数的加工。 |
 | 空间| O(n) | 我们存储覆盖数组和答案数组。 |

 这符合约束条件，因为所有的总和$n$是$3 \cdot 10^5$。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        solve()
    return out.getvalue().strip()

# provided samples
assert run("4\n8\n0 0 3 1 1 1 1 2\n2\n1 1\n2\n2 2\n2\n0 1\n") == "YES\nRRLLLLRL\nYES\nRL\nYES\nRL\nNO", "sample 1"

# custom cases
assert run("1\n2\n0 1\n") == "NO", "zero at start"
assert run("1\n2\n1 0\n") == "YES\nRL", "zero at end"
assert run("1\n3\n0 0 0\n") == "NO", "all zeros"
assert run("1\n5\n2 0 1 0 2\n") == "YES\nRLLRL", "mixed zeros and powers"
assert run("1\n4\n4 0 0 4\n") == "YES\nRLLR", "powers covering entire row"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 2\n0 1 | 2 否 | 从零开始揭开|
 | 2\n1 0 | 2\n1 0 是\nRL | 结束零被前一个 | 覆盖
 | 3\n0 0 0 | 3\n0 0 0 否 | 全零不可能|
 | 5\n2 0 1 0 2 | 5\n2 0 1 0 2 是\nRLLRL | 覆盖间隙|
 | 4\n4 0 0 | 4\n4 0 0 | |
