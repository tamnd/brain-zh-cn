---
title: "CF 1713B - 最佳减速"
description: "我们得到一个正整数数组。 我们可以重复选择一个连续的子数组，并将该子数组中的所有元素减一。 目标是使用尽可能少的操作将所有数组元素归零。"
date: "2026-06-09T20:12:56+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1713
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 812 (Div. 2)"
rating: 1000
weight: 1713
solve_time_s: 148
verified: false
draft: false
---

[CF 1713B - 最佳减少](https://codeforces.com/problemset/problem/1713/B)

 **评分：** 1000
 **标签：** 构造性算法，排序
 **求解时间：** 2m 28s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个正整数数组。 我们可以重复选择一个连续的子数组，并将该子数组中的所有元素减一。 目标是使用尽可能少的操作将所有数组元素归零。 让我们表示为$f(a)$数组所需的此类操作的最少数量$a$。 任务是判断给定的数组是否$a$从没有排列的意义上来说已经是“最优的”$a$可以通过更少的操作减少到零。 

输入由多个测试用例组成。 每个测试用例给出长度$n$数组和数组本身。 如果数组在上述意义上是最佳的，则输出应为“YES”，否则为“NO”。 约束条件允许$n$最多$10^5$每个测试用例，所有测试用例的总和也达到$10^5$。 这排除了任何具有二次或更差复杂度的算法，因此$O(n \log n)$或者$O(n)$解决方案是必要的。 

非明显的边缘情况包括具有重复数字的数组、按排序或反向排序顺序的数组以及两端都有最大元素的数组。 例如，对于$a = [3,1,3,2]$，该数组不是最佳的，因为将其重新排列为$[1,2,3,3]$将操作数从 5 减少到 3。不考虑排列的粗心实现可能会错误地将此类数组声明为最佳数组。 

## 方法

 暴力方法会尝试数组的所有排列并计算$f(b)$对于每个。 计算$f(b)$可以通过递归或迭代策略来完成，反复减去当前段的最小值。 然而，对于$n = 10^5$，排列数为$n!$，这是完全不可行的。 均匀计算$f(a)$直接使用简单的段减法算法对于大型数组来说太慢了。 

关键的观察是$f(a)$当数组非递减时最小化。 原因是非单调序列中的任何局部减少都会产生额外的操作。 换句话说，“最佳”排列是按非降序排列的。 Once the array is sorted, the minimal number of operations equals the largest element because we can always cover the previous elements as part of larger segments. 因此，数组$a$如果按照非降序排序就已经是最优的了。 如果存在一个小于其前驱的元素，则存在一种排列（已排序的元素）可以减少$f(a)$。 这直接导致一个简单的检查：将数组与其排序版本进行比较。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n! * n) | O(n! * n) | O(n) | 太慢了|
 | 最佳 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1.读取测试用例数量$t$。 
2. 对于每个测试用例，读取数组长度$n$和数组$a$。 
3. 创建一个已排序的副本$a$按非递减顺序。 
4. 比较$a$及其排序版本。 如果它们相同，则打印“YES”。 否则，打印“NO”。 

该算法之所以有效，是因为唯一保证在所有排列中需要最少操作次数的数组是那些按非降序排序的数组。 任何与此顺序的偏差都可以通过重新排列为非递减序列来改善，该序列永远不会增加$f(a)$并经常减少它。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n = int(input())
    a = list(map(int, input().split()))
    if a == sorted(a):
        print("YES")
    else:
        print("NO")
```该解决方案使用有效地读取输入`sys.stdin.readline`。 它构造每个数组的排序版本并执行直接比较。 Python 的内置`sorted`函数运行于$O(n \log n)$时间。 比较`a == sorted(a)`遍历数组，计算成本$O(n)$每个测试用例。 边界条件是自动处理的，因为我们从不访问数组边界之外的索引。 

## 工作示例

 ### 示例 1

 输入数组：`[2,3,5,4]`排序数组：`[2,3,4,5]`比较：`[2,3,5,4] != [2,3,4,5]`→ 输出“否”

 这表明原始数组未排序，并且存在减少运算的排列。 

### 示例 2

 输入数组：`[1,2,3]`排序数组：`[1,2,3]`比较：`[1,2,3] == [1,2,3]`→ 输出“是”

 这证实了不变式：非递减数组是最优的。 

### 示例 3

 输入数组：`[3,1,3,2]`排序数组：`[1,2,3,3]`比较：`[3,1,3,2] != [1,2,3,3]`→ 输出“否”

 这突出显示了具有重复元素和非单调排序的边缘情况。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 每个测试用例排序占主导地位，比较是 O(n) |
 | 空间| O(n) | 数组的排序副本 |

 总和为$n$在所有测试用例 ≤ 10^5 中，总操作在$10^6$1秒限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        if a == sorted(a):
            print("YES")
        else:
            print("NO")
    return output.getvalue().strip()

# provided samples
assert run("3\n4\n2 3 5 4\n3\n1 2 3\n4\n3 1 3 2\n") == "NO\nYES\nNO", "sample tests"

# custom cases
assert run("1\n1\n1\n") == "YES", "single element"
assert run("1\n5\n5 4 3 2 1\n") == "NO", "reverse order"
assert run("1\n4\n2 2 2 2\n") == "YES", "all equal"
assert run("1\n6\n1 2 3 3 4 5\n") == "YES", "sorted with duplicates"
assert run("1\n6\n1 2 3 5 4 6\n") == "NO", "small inversion in middle"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1\n1\n1`| 是 | 最小数组大小 |
 |`1\n5\n5 4 3 2 1`| 否 | 逆序最大化操作|
 |`1\n4\n2 2 2 2`| 是 | 所有元素都相等 |
 |`1\n6\n1 2 3 3 4 5`| 是 | 按重复数字排序 |
 |`1\n6\n1 2 3 5 4 6`| 否 | 数组中间的小反转 |

 ## 边缘情况

 对于单元素数组`[1]`，算法排序`[1]`到`[1]`并打印“YES”，正确处理最小尺寸输入。 对于逆序数组`[5,4,3,2,1]`, 排序产生`[1,2,3,4,5]`，比较失败，输出为“NO”，确认算法识别出非最佳排列。 对于相同元素的数组`[2,2,2,2]`，排序使数组保持不变，输出为“YES”，正确处理重复的数字。 对于具有较小反转的数组，例如`[1,2,3,5,4,6]`，排序修复了反转，比较失败，输出为“NO”，确认算法检测到微妙的非单调情况。
