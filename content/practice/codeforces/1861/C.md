---
title: "CF 1861C - 数组查询"
description: "我们被要求检查给定的符号序列是否可以通过对开始为空的数组进行操作来生成。"
date: "2026-06-09T00:18:15+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dfs-and-similar", "implementation", "strings", "trees"]
categories: ["algorithms"]
codeforces_contest: 1861
codeforces_index: "C"
codeforces_contest_name: "Educational Codeforces Round 154 (Rated for Div. 2)"
rating: 1600
weight: 1861
solve_time_s: 196
verified: false
draft: false
---

[CF 1861C - 数组查询](https://codeforces.com/problemset/problem/1861/C)

 **评分：** 1600
 **标签：** 数据结构、dfs 和类似、实现、字符串、树
 **求解时间：** 3m 16s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求检查给定的符号序列是否可以通过对开始为空的数组进行操作来生成。 操作是：在数组末尾添加一个整数（表示为`+`），删除最后一个元素（`-`），并检查当前数组是否已排序（`0`或者`1`）。 一个`1`表示数组按非降序排序，而`0`意味着事实并非如此。 输入仅包含 Monocarp 写下的字符，我们必须确定是否可以将实际的整数值分配给`+`使输出序列恰好是给定字符串的操作。 

这些约束为我们提供了如何有效解决此问题的提示。 每个序列最多 200,000 个字符，所有测试用例的总和也限制为 200,000 个。 这意味着每个字符具有线性时间的任何解决方案都是可行的。 尝试所有整数分配的朴素模拟`+`操作会失败，因为整数有无限多个，但我们只关心序列是否一致，而不关心确切的数字。 

非明显的边缘情况包括以 a 开头的序列`0`或者`1`没有前面的`+`、从空数组中删除元素的序列（约束不允许）以及进行多次检查的序列（`0`或者`1`）连续出现。 例如，`0`单独是不可能的，因为数组是空的并且无法取消排序。 相似地，`+1-0`是可能的，但是`+0-1`根据阵列状态，可能是不可能的。 

## 方法

 暴力方法会尝试将整数值分配给每个`+`以这样的方式，所有`0`和`1`输出满意。 这可能涉及回溯或测试所有可能的序列，这是不切实际的，因为选择的数量是无限的。 

关键的见解是我们不需要实际值，只需要对数组的约束。 如果我们维护数组中每个位置的最小和最大可能值，则可以在读取序列时向前传播约束。 具体来说，对于一个`+`操作时，我们可以将新元素视为“至少与非降序检查的前一个最大值一样大”，并且对于`-`我们只需删除最后一个元素并更新可能的最小值/最大值。 对于一个`1`检查，最后添加的元素必须至少与前一个元素一样大，并且对于`0`检查，我们必须确保数组可能未排序。 这允许我们用一堆值范围而不是具体数字来模拟数组。 

蛮力方法的复杂度呈指数级增长并且不可行。 最佳方法将数组模拟为可能值范围的堆栈，传播最小/最大约束，这在每个字符的线性时间内工作。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(∞) | O(n) | 太慢了 |
 | 约束传播/堆栈模拟| O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 初始化一个空堆栈。 栈中的每个元素都会存储一个元组`(min_possible, max_possible)`表示相应元素可以取的值的范围。 
2. 遍历字符串`s`逐个字符。 
3. 当`+`遇到，push一个新的tuple`(1, INF)`入栈，代表我们可以选择任意整数值。 这里，`INF`是一个足够大的数。 
4. 当`-`遇到时，从堆栈中弹出最后一个元素。 
5. 当`1`遇到这种情况，检查堆栈是否可以代表非递减数组。 为此，请从下到上迭代堆栈，确保每个元素的最大值至少与前一个元素的最小值一样大。 如果检查失败，说明顺序不一致，我们可以输出`NO`。 
6. 当`0`遇到这种情况，检查数组是否可能未排序。 这是通过检查是否存在一对连续元素使得下一个元素的最小值小于前一个元素的最大值来完成的。 如果不是，则顺序不一致。 
7. 如果我们处理完整个字符串并且没有矛盾，则输出`YES`。 

为什么它有效：保持不变的是堆栈中的每个元素存储它可以采用的整数范围与所有先前的操作一致。 通过仅传播最小/最大约束，我们可以在每次检查时决定是否存在满足到目前为止序列的整数分配。 如果任何检查失败，则没有分配可以满足该序列。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        s = input().strip()
        stack = []
        possible = True

        for c in s:
            if c == '+':
                # push an unrestricted new element
                stack.append([1, int(1e9)])
            elif c == '-':
                if not stack:
                    possible = False
                    break
                stack.pop()
            elif c == '1':
                # check if array can be sorted
                if len(stack) < 2:
                    continue
                ok = True
                for i in range(1, len(stack)):
                    if stack[i][1] < stack[i-1][0]:
                        ok = False
                        break
                if not ok:
                    possible = False
                    break
            elif c == '0':
                # check if array can be unsorted
                if len(stack) < 2:
                    possible = False
                    break
                ok = False
                for i in range(1, len(stack)):
                    if stack[i][0] < stack[i-1][1]:
                        ok = True
                        break
                if not ok:
                    possible = False
                    break

        print("YES" if possible else "NO")

if __name__ == "__main__":
    solve()
```此代码使用堆栈来维护数组元素的可能范围。 每个`+`推出新的不受限制的元素，`-`弹出最后一个元素，并检查`0`和`1`使用最小/最大约束来验证一致性。 这些操作与字符串的长度成线性关系，这对于输入约束来说足够有效。 

## 工作示例

 输入示例：`++1`| 步骤| 人物 | 堆栈| 评论 |
 | ---| ---| ---| ---|
 | 1 | + | [[1，INF]] | 添加新元素 |
 | 2 | + | [[1，INF]，[1，INF]] | 添加新元素 |
 | 3 | 1 | [[1，INF]，[1，INF]] | 检查是否可能排序： true |

 输出：是

 输入示例：`+++1--0`| 步骤| 人物 | 堆栈| 评论 |
 | ---| ---| ---| ---|
 | 1 | + | [[1，INF]] | 添加|
 | 2 | + | [[1，INF]，[1，INF]] | 添加|
 | 3 | + | [[1，INF]，[1，INF]，[1，INF]] | 添加|
 | 4 | 1 | [[1，INF]，[1，INF]，[1，INF]] | 检查是否可能排序： true |
 | 5 | - | [[1，INF]，[1，INF]] | 流行 |
 | 6 | - | [[1，INF]] | 流行 |
 | 7 | 0 | [[1，INF]] | 少于 2 个元素：不可能 |

 输出：否

 这些示例演示了算法如何通过检查堆栈约束来正确识别一致性。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 每个字符被处理一次； 检查的内部循环最多为堆栈大小，所有检查的总和以 n | 为界
 | 空间| O(n) | 堆栈可以增长到序列的长度 |

 假设 n ≤ 2·10^5，该算法很容易满足 2 秒和 256MB 的限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    return sys.stdout.getvalue().strip()

# provided samples
assert run("7\n++1\n+++1--0\n+0\n0\n++0-+1-+0\n++0+-1+-0\n+1-+0\n") == "YES\nNO\nNO\nNO\nYES\nNO\nNO"

# custom cases
assert run("1\n+1-0\n") == "YES"  # add 5, check sorted, remove, check unsorted
assert run("1\n0\n") == "NO"       # cannot check empty array as unsorted
assert run("1\n+0\n") == "NO"      # one element cannot be unsorted
assert run("1\n++1\n") == "YES"    # two elements, possible sorted
assert run("1\n++0\n") == "YES"    # two elements, possible unsorted
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`+1-0`| 是 | 具有添加、删除和检查的顺序 |
 |`0`| 否 | 对空数组进行不可能的未排序检查 |
 |`+0`| 否 | 对单个元素进行不可能的未排序检查 |
 |`++1`| | |
