---
title: "CF 105873C - 塞拉亚斯新标志"
description: "在这个问题中，我们有两个字符串。 第一个是当前印在标志上的文本，第二个是应该出现的文本。"
date: "2026-06-25T14:26:35+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105873
codeforces_index: "C"
codeforces_contest_name: "2025 ICPC Gran Premio de Mexico 1ra Fecha"
rating: 0
weight: 105873
solve_time_s: 51
verified: true
draft: false
---

[CF 105873C - 塞拉亚斯新标志](https://codeforces.com/problemset/problem/105873/C)

 **评级：** -
 **标签：** -
 **求解时间：** 51s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 在这个问题中，我们有两个字符串。 第一个是当前印在标志上的文本，第二个是应该出现的文本。 唯一允许的更正是单个操作，选择当前字符串的一个连续部分，将其切成两个连续的部分，然后交换这两个部分。 任务是确定是否可以到达目标字符串，如果可以，则输出一个有效的段和分割位置选择。 

该操作可以看作是获取一个子串并将其向左旋转。 如果选择的区间是从`l`到`r`，以及最后一个`k`字符移到前面，中间部分变为：`A[l:r+1]`进入：`A[r-k+1:r+1] + A[l:r-k+1]`该间隔之外的所有内容都保持完全相同。 

字符串的长度可以达到`100000`，因此尝试每个间隔和每个可能的分割是不可行的。 有大约`n^3`如果直接实现可能的操作，这将是大约`10^15`在最坏的情况下进行检查。 我们需要一个接近线性或`n log n`。 

首先要观察的是，修改后的区间之外的仓位必须已经是正确的。 这给了我们可能改变的最小间隔：从第一个位置开始，`A`和`B`与最后一个不同的位置不同。 

一个常见的错误是让移动的部分为空或整个选定的间隔。 该操作要求所选区间内的两个片段都有效，因此分割点必须在第一个片段中至少留下一个字符。 例如，如果：```
A = ABC
B = CAB
```答案可以是：```
0 2 1
```但是移动所有三个字符的分割将不是有效的操作。 

另一个边缘情况是字符串已经相等。 正确答案仍然是`Yes`，因为不允许执行任何有效的更改。 为了：```
A = AAA
B = AAA
```输出可以描述长度为一的间隔`k = 0`。 仅搜索不匹配的解决方案将错误地拒绝这种情况。 

当更改的间隔包含实际差异周围的匹配字符时，就会出现最后一个棘手的情况。 为了：```
A = AXXB
B = AXBX
```如果旋转需要，操作必须包括周围位置。 仅检查不匹配的字符是否形成排列是不够的，因为它们在旋转后的位置很重要。 

## 方法

 蛮力的想法是尝试每一个可能的区间和每一个可能的分割点。 对于每个选择，我们构造结果字符串并将其与目标进行比较。 这是正确的，因为考虑了所有可能的操作。 然而，有`O(n^2)`间隔和最多`O(n)`对每个间隔进行分割，给出`O(n^3)`时间。 和`n = 100000`，这已经远远超出了可以运行的范围。 

有用的观察结果是该操作仅旋转一个子字符串。 首先，更改部分之前的前缀和之后的后缀必须已经匹配。 这意味着唯一有趣的区域是第一个和最后一个不匹配之间。 

假设这个最小间隔是`[l, r]`。 在这个区间内，我们需要检查目标子串是否是原始子串的旋转。 通过将原始子串连续放置两次，可以有效地找到旋转。 长度字符串的任意旋转`m`显示为长度加倍的字符串的子字符串`m`。 

因此，我们将问题简化为单个模式匹配操作。 我们寻找`B[l:r+1]`里面`(A[l:r+1] + A[l:r+1])`。 如果它从位置开始`d`，然后子串向左旋转`d`人物。 所需的输出参数是`k = length - d`， 因为`k`是从末尾移动到前面的字符数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n^3) | O(n^3) | O(n) | 太慢了 |
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1.找到第一个索引`l`在哪里`A[l]`和`B[l]`不同，最后一个索引`r`它们的不同之处。 如果不存在这样的索引，则输出任何有效的不改变操作。 
2. 取子串`A[l:r+1]`以及对应的目标子串`B[l:r+1]`。 这些是手术后唯一可能有所不同的部分。 如果原始操作存在，则该目标子串必须是原始操作的旋转。 
3. 创建双倍字符串`A[l:r+1] + A[l:r+1]`并搜索`B[l:r+1]`在里面。 使用 KMP 使搜索保持线性。 
4. 如果图案从位置开始出现`d`，子串向左旋转`d`职位。 从末尾移动的量是`k = length - d`。 输出`l`,`r`， 和`k`。 
5. 如果没有找到模式，则不存在有效操作，因此输出`No`。 

为什么有效：第一个和最后一个不匹配之外的间隔无法修改，因为这些字符已经匹配，并且旋转只会影响所选的间隔。 在剩余的间隔内，唯一可能的变换是循环移位。 双串搜索精确检查是否存在这样的循环移位，并且返回的移位直接确定所需的分割。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def kmp_search(text, pattern):
    m = len(pattern)
    if m == 0:
        return 0

    pi = [0] * m
    j = 0
    for i in range(1, m):
        while j and pattern[i] != pattern[j]:
            j = pi[j - 1]
        if pattern[i] == pattern[j]:
            j += 1
        pi[i] = j

    j = 0
    for i, c in enumerate(text):
        while j and c != pattern[j]:
            j = pi[j - 1]
        if c == pattern[j]:
            j += 1
        if j == m:
            return i - m + 1
    return -1

def solve():
    a = input().strip()
    b = input().strip()
    n = len(a)

    l = 0
    while l < n and a[l] == b[l]:
        l += 1

    if l == n:
        print("Yes")
        print(0, 0, 0)
        return

    r = n - 1
    while a[r] == b[r]:
        r -= 1

    s = a[l:r + 1]
    t = b[l:r + 1]
    m = len(s)

    pos = kmp_search(s + s, t)

    if pos == -1 or pos >= m:
        print("No")
        return

    k = m - pos
    if k == m:
        k = 0

    print("Yes")
    print(l, r, k)

solve()
```代码首先隔离唯一可能不同的区域。 这可以防止对已经正确的前缀和后缀进行不必要的工作。 

KMP 函数为目标子字符串构建前缀数组，并在双倍源子字符串中查找其第一次出现。 仅搜索双倍子字符串就足够了，因为每个有效旋转都从第一个副本内的某个位置开始。 

从找到的位置到的转换`k`是微妙的部分。 匹配位置是从前到后移动的字符数。 该问题要求从后移到前的数字，因此这些值是互补的。 

因为不存在不匹配区间，所以单独处理相等情况。 印刷`k = 0`避免任何无效的分割。 

## 工作示例

 对于样本：```
A = ABC
B = ACB
```该算法的行为如下。 

| 步骤| 我| r | 子串 A | 子串 B | 比赛位置| 结果|
 | ---| ---| ---| ---| ---| ---| ---|
 | 初始| 1 | 2 | 公元前 | CB | 1 | 是的 |
 | 输出| 1 | 2 | 乙| C | k = 1 | 1 2 1 | 1 2 1

 间隔为`BC`。 将其向左旋转 1 给出`CB`，生成目标字符串。 

另一个例子：```
A = ABCDE
B = ACBDE
```| 步骤| 我| r | 子串 A | 子串 B | 比赛位置| 结果|
 | ---| ---| ---| ---| ---| ---| ---|
 | 初始| 1 | 2 | 公元前 | CB | 1 | 是的 |
 | 输出| 1 | 2 | 公元前 | CB | k = 1 | 1 2 1 | 1 2 1

 该跟踪表明仅考虑更改的中间部分。 周围的字符将被忽略，因为它们已经固定。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 查找不匹配和运行 KMP 都需要线性时间 |
 | 空间| O(n) | 前缀数组和双倍子串使用线性内存 |

 最大字符串长度为`100000`，因此线性算法很容易满足通常的竞争性编程对时间和内存的限制。 

## 测试用例```python
import sys, io

def solve_case(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    def kmp_search(text, pattern):
        m = len(pattern)
        pi = [0] * m
        j = 0
        for i in range(1, m):
            while j and pattern[i] != pattern[j]:
                j = pi[j - 1]
            if pattern[i] == pattern[j]:
                j += 1
            pi[i] = j
        j = 0
        for i, c in enumerate(text):
            while j and c != pattern[j]:
                j = pi[j - 1]
            if c == pattern[j]:
                j += 1
            if j == m:
                return i - m + 1
        return -1

    a = input().strip()
    b = input().strip()

    n = len(a)
    l = 0
    while l < n and a[l] == b[l]:
        l += 1

    if l == n:
        return "Yes\n0 0 0\n"

    r = n - 1
    while a[r] == b[r]:
        r -= 1

    s = a[l:r + 1]
    t = b[l:r + 1]
    pos = kmp_search(s + s, t)

    if pos == -1 or pos >= len(s):
        return "No\n"

    k = len(s) - pos
    if k == len(s):
        k = 0
    return f"Yes\n{l} {r} {k}\n"

assert solve_case("ABC\nACB\n") == "Yes\n1 2 1\n"
assert solve_case("AAA\nAAA\n") == "Yes\n0 0 0\n"
assert solve_case("ABCDE\nACBDE\n") == "Yes\n1 2 1\n"
assert solve_case("ABCD\nABDC\n") == "Yes\n2 3 1\n"
assert solve_case("ABC\nBAC\n") == "Yes\n0 1 1\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`AAA / AAA`| 是的 | 已经正确的字符串 |
 |`ABCDE / ACBDE`| 是的 | 小内旋 |
 |`ABCD / ABDC`| 是的 | 后缀侧动 |
 |`ABC / BAC`| 是的 | 前缀移动|

 ## 边缘情况

 对于相等字符串的情况：```
A = AAA
B = AAA
```该算法没有发现不匹配。 它立即返回一个无操作操作。 这是可行的，因为允许的操作计数为零或一，因此不进行任何更改都是可以接受的。 

对于更改部分是整个有意义区域的情况：```
A = ABC
B = CAB
```失配间隔变为`[0,2]`。 加倍的字符串是`ABCABC`， 和`CAB`出现在索引处`2`。 该算法将其转换为`k = 1`，给出有效的旋转。 

对于不是旋转的情况：```
A = ABCD
B = ACBD
```中间的子串是`ABCD`相对`ACBD`。 搜寻中`ACBD`在`ABCDABCD`失败，因此算法正确地拒绝转换。 

对于只有两个字符的边界情况：```
A = AB
B = BA
```间隔的长度为二。 加倍的字符串是`ABAB`， 和`BA`出现在索引一处。 算法输出`k = 1`，这是唯一有效的分割。
