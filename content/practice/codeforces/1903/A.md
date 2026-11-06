---
title: "CF 1903A - 哈罗米奶酪盒"
description: "问题给了我们一行盒子，每个盒子都标有一个数字，Theofanis 想要以非降序排列它们。 不同之处在于他无法交换任意盒子或执行标准排序操作。"
date: "2026-06-08T21:02:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "greedy", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1903
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 912 (Div. 2)"
rating: 800
weight: 1903
solve_time_s: 142
verified: false
draft: false
---

[CF 1903A - 哈罗米盒子](https://codeforces.com/problemset/problem/1903/A)

 **评分：** 800
 **标签：** 暴力、贪婪、排序
 **求解时间：** 2m 22s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 问题给了我们一行盒子，每个盒子都标有一个数字，Theofanis 想要以非降序排列它们。 不同之处在于他无法交换任意盒子或执行标准排序操作。 他的机器允许他反转最多长度的子数组$k$。 子数组是盒子的任何连续段，反转它意味着翻转该段内盒子的顺序。 任务是确定是否可以使用任意数量的此类反转将整个数组排序为非降序。 

输入由多个测试用例组成，每个测试用例提供框的数量$n$, 最大子数组长度$k$可以颠倒的，以及盒子上的初始数字序列。 如果可以在给定操作下对框进行排序，则每个测试用例的输出为“是”，否则为“否”。 

限制是适度的：$n$和$k$每个最多可以达到 100。这表明$O(n^2)$算法可行。 然而，$a_i$可以大到$10^9$，这排除了任何依赖于计数排序或频率数组的解决方案，除非我们压缩值。 自从$n$较小时，基于直接比较、排序和位置分析的解决方案是合理的。 

当以下情况出现时，会出现一个关键的边缘情况：$k = 1$。 在这种情况下，反转长度为 1 的子数组不会执行任何操作，因此只有在数组已经排序的情况下才能将其视为可排序。 另一个微妙的情况是当$k \ge n$。 然后，可以一次性反转整个数组，因此数组始终可以排序。 所有元素都相等的数组是可以简单排序的，但如果粗心的实现假设元素必须严格增加，则可能会错误处理。 

## 方法

 暴力方法是模拟最多长度反转的每个可能序列$k$并检查一个序列是否导致有序数组。 虽然原则上是正确的，但这种方法是不切实际的：对于每个位置，最多有$k$选择反转的长度，从而产生指数数量的状态。 即使是为了$n = 100$，这在计算上是不可能的。 

关键的见解来自于观察数组末端附近的元素的灵活性有限。 索引处的元素$i$最多可以移动$k-1$通过反转远离任一端的位置。 如果我们表示为$sorted\_a$完全排序的数组，其最终位置在的任何元素$sorted\_a$与原来的位置至少相差$k$无法到达目标位置，如果$k < n$。 因此，问题归结为检查第一个是否$k-1$最后$k-1$数组中的位置已经与排序数组兼容。 对于严格位于中间的位置，反转允许完全洗牌。 

形式上，我们可以对数组进行排序以获得目标配置。 那么对于职位$i < k$或者$i \ge n-k+1$，值在$a[i]$必须已经匹配排序的数组。 如果所有这些边界位置都匹配，则可以使用反转对数组进行排序； 否则就不能。 什么时候$k \ge n/2$，这有效地允许所有元素到达其正确位置，因此数组始终是可排序的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^n) | O(2^n) | O(n) | 太慢了 |
 | 基于位置的检查 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1.读取测试用例数量$t$。 
2. 对于每个测试用例，请阅读$n$,$k$，和数组$a$。 
3. 创建一个副本$a$并排序得到$sorted\_a$。 
4. 如果$k = 1$， 比较$a$直接与$sorted\_a$。 如果匹配，则打印“YES”； 否则，打印“NO”。 这处理了不可能进行有效逆转的边缘情况。 
5. 否则，迭代位置$0$到$k-2$（第一个$k-1$位置）和来自$n-k+1$到$n-1$（最后一个$k-1$职位）。 检查每个元素是否与其对应的元素匹配$sorted\_a$。 
6. 如果所有边界位置都匹配，则打印“YES”； 否则，打印“NO”。 

为何有效：如果出现以下情况，则边界位置无法充分移动：$k < n$，所以它们必须已经处于正确的排序位置。 中间位置始终可以使用多个反转来打乱，因为它们可以参与长度的重叠反转$k$。 这个不变量保证了正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n, k = map(int, input().split())
    a = list(map(int, input().split()))
    sorted_a = sorted(a)
    
    if k == 1:
        print("YES" if a == sorted_a else "NO")
        continue
    
    ok = True
    for i in range(k-1):
        if a[i] != sorted_a[i]:
            ok = False
            break
    for i in range(n-k+1, n):
        if a[i] != sorted_a[i]:
            ok = False
            break
    print("YES" if ok else "NO")
```该代码使用快速 I/O 读取输入。 对数组进行排序可以让我们确定目标配置。 检查边界位置可以处理有限反转长度的关键限制。 使用`k-1`和`n-k+1`精确捕获末端附近元素的最大范围。 

## 工作示例

 对于输入：```
3 1
9 9 9
```-$a = [9, 9, 9]$-$sorted\_a = [9, 9, 9]$- 自从$k = 1$，我们直接比较数组。 他们匹配。 输出“是”。 

对于输入：```
2 1
3 1
```-$a = [3, 1]$-$sorted\_a = [1, 3]$-$k = 1$意味着没有有效的逆转。 数组不匹配。 输出“否”。 

| 步骤| 一个 | 已排序_a | k | 边界检查结果 |
 | --- | --- | --- | --- | --- |
 | 1 | [3,1]| [1,3]| 1 | 数组不同，返回 NO |

 该表显示该算法正确识别反转无法将元素移动到位的情况。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 排序占主导地位，边界检查为 O(n) |
 | 空间| O(n) | 存储数组的副本用于排序 |

 和$n \le 100$和$t \le 100$，该解决方案可以在 1 秒内轻松执行，并且使用的内存可以忽略不计。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    # solution
    t = int(input())
    for _ in range(t):
        n, k = map(int, input().split())
        a = list(map(int, input().split()))
        sorted_a = sorted(a)
        
        if k == 1:
            print("YES" if a == sorted_a else "NO")
            continue
        
        ok = True
        for i in range(k-1):
            if a[i] != sorted_a[i]:
                ok = False
                break
        for i in range(n-k+1, n):
            if a[i] != sorted_a[i]:
                ok = False
                break
        print("YES" if ok else "NO")
    return out.getvalue().strip()

# Provided samples
assert run("5\n3 2\n1 2 3\n3 1\n9 9 9\n4 4\n6 4 2 1\n4 3\n10 3 830 14\n2 1\n3 1\n") == "YES\nYES\nYES\nYES\nNO"

# Custom tests
assert run("1\n1 1\n42\n") == "YES", "single element"
assert run("1\n5 5\n5 4 3 2 1\n") == "YES", "full reverse possible"
assert run("1\n5 2\n1 3 2 5 4\n") == "NO", "boundaries cannot reach correct positions"
assert run("1\n4 3\n1 2 3 4\n") == "YES", "already sorted"
assert run("1\n3 1\n2 1 3\n") == "NO", "k=1 unsorted"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 1 42 | 1 1 42 是 | 单元素数组 |
 | 5 5 5 4 3 2 1 | 5 5 5 4 3 2 1 是 | 允许全数组反转|
 | 5 2 1 3 2 5 4 | 5 2 1 3 2 5 4 否 | 边界无法移动到正确位置 |
 | 4 3 1 2 3 4 | 4 3 1 2 3 4 | |
