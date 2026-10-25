---
title: "CF 1295C - 获取字符串"
description: "我们有两个字符串，s 和 t。 最初，我们有一个空字符串 z，我们想要将 z 转换为 t。 允许的操作是将 s 的任意子序列附加到 z 上。 通过从 s 中选择字符而不改变其相对顺序来形成子序列。"
date: "2026-06-11T18:36:22+07:00"
tags: ["codeforces", "competitive-programming", "dp", "greedy", "strings"]
categories: ["algorithms"]
codeforces_contest: 1295
codeforces_index: "C"
codeforces_contest_name: "Educational Codeforces Round 81 (Rated for Div. 2)"
rating: 1600
weight: 1295
solve_time_s: 102
verified: true
draft: false
---

[CF 1295C - 获取字符串](https://codeforces.com/problemset/problem/1295/C)

 **评分：** 1600
 **标签：** dp、贪婪、字符串
 **求解时间：** 1m 42s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有两个字符串，`s`和`t`。 最初，我们有一个空字符串`z`，我们想要转变`z`进入`t`。 允许的操作是附加任何子序列`s`到`z`。 通过从以下位置选择字符来形成子序列`s`而不改变它们的相对顺序。 每次执行操作时，我们可以附加任意数量的字符`s`按顺序排列，但我们无法重新排序`s`或者在外面使用新的字符`s`。 

我们的任务是确定构建所需的此类操作的最少数量`t`。 如果无法形成`t`因为其中的某些角色`t`没有出现在`s`，我们应该返回`-1`。 

约束条件意味着`s`和`t`可以达到`10^5`每个字符，所有测试用例的总长度是`2*10^5`。 在 1 秒的时间限制下，任何复杂度低于`O(|s| + |t|)`每个测试用例可能会超时。 两个字符串上的嵌套循环将产生`O(|s|*|t|)`这太慢了。 

简单的解决方案可能失败的边缘情况包括`t`包含不存在于中的字符`s`， 例如，`s = "abc"`和`t = "d"`。 正确的输出是`-1`。 另一个微妙的情况是当`t`可以通过重复使用来形成`s`在不重叠的子序列中多次出现，例如`s = "ab"`,`t = "ababab"`，这需要仔细计算次数`s`必须附加。 

## 方法

 蛮力方法是从开头开始`t`并反复尝试找到最长的子序列`s`与当前后缀匹配`t`。 每次使用子序列时，我们都会向前移动`t`匹配子序列的长度并重复直到结束`t`。 这是有效的，因为每个操作都会严格增加`z`沿着`t`。 然而，天真地找到子序列需要扫描`s`对于每个角色`t`。 如果`s`和`t`都是长度`10^5`，最坏情况的复杂度变为`O(|s|*|t|)`或者`10^{10}`操作，这显然太慢了。 

关键的见解是我们可以预处理`s`以允许更快的子序列匹配。 我们可以记录每个字符的位置`s`这样对于每个字符`t`，我们可以快速找到下一个出现的位置`s`在给定索引之后。 这可以使用列表字典和二分搜索来实现。 通过这个预处理，我们可以遍历`t`线性地同时有效地定位匹配`s`，将复杂度降低为`O(|s| + |t| log |s|)`。 

蛮力之所以有效，是因为我们总是试图匹配`t`使用子序列`s`，但是当`t`很长。 观察结果表明`s`是静态的并且可以被索引，允许我们通过二分搜索来模拟线性扫描中的子序列附加操作以查找下一个字符。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O( | s | * |
 | 最佳 | O( | s | + |

 ## 算法演练

 1. 预处理`s`记录每个字符的索引。 创建字典`pos`这样`pos[c]`是所有索引的排序列表，其中字符`c`发生在`s`。 这使我们能够快速定位下一个出现的位置`c`在给定索引之后使用二分搜索。 
2. 初始化计数器`operations = 1`跟踪我们需要的子序列附加的数量。 开始扫描`t`从第一个字符开始，并保留一个指针`current_index`到当前位置`s`我们试图匹配的下一个字符`t`。 
3. 对于每个角色`c`在`t`，检查是否`c`存在于`s`。 如果没有，立即返回`-1`因为不可能形成`t`。 
4. 使用预处理列表`pos[c]`, 找到第一个出现的`c`在`s`之后`current_index`。 如果出现这种情况，请移步`current_index`到该索引 + 1。这模拟了匹配`c`在当前的子序列中。 
5. 如果没有出现以下情况`c`后`current_index`，这意味着我们必须开始一个新的子序列追加。 增量`operations`，并设置`current_index`到第一次出现`c`在`s`+ 1。 
6. 继续此过程，直到所有字符都出现在`t`是匹配的。 

### 为什么它有效

 不变的是`current_index`始终指向下一个可用字符`s`对于当前的子序列追加。 每次我们都无法匹配超出范围的字符`current_index`，我们开始一个新的子序列。 这确保了每个追加的长度是最大的，并且我们计算的操作数量是最少的。 不会跳过任何字符，并且中的每个字符`t`与中的相应字符匹配`s`，保证正确性。 

## Python 解决方案```python
import sys
import bisect
input = sys.stdin.readline

def min_operations(s, t):
    pos = {}
    for i, c in enumerate(s):
        if c not in pos:
            pos[c] = []
        pos[c].append(i)
    
    operations = 1
    current_index = -1
    
    for c in t:
        if c not in pos:
            return -1
        idx_list = pos[c]
        i = bisect.bisect_right(idx_list, current_index)
        if i == len(idx_list):
            operations += 1
            current_index = idx_list[0]
        else:
            current_index = idx_list[i]
    return operations

T = int(input())
for _ in range(T):
    s = input().strip()
    t = input().strip()
    print(min_operations(s, t))
```代码首先进行预处理`s`创造`pos`，列表字典。 对于中的每个字符`t`，它使用`bisect_right`查找之后的下一个出现`current_index`。 如果未找到有效位置，则会增加操作计数器并从第一次出现的位置重新开始。 这保证了我们计算子序列附加的最少数量。 

## 工作示例

 ### 示例 1

 输入：`s = "aabce"`,`t = "ace"`| t_char | 当前索引 | 位置[c] | 二等分结果 | 运营|
 | ---| ---| ---| ---| ---|
 | 一个 | -1 | [0,1]| 0 | 1 |
 | c | 1 | [3] | 0 | 1 |
 | 电子| 3 | [4] | 0 | 1 |

 的所有字符`t`可以在单遍中匹配，所以输出是`1`。 

### 示例 2

 输入：`s = "abacaba"`,`t = "aax"`| t_char | 当前索引 | 位置[c] | 二等分结果 | 运营|
 | ---| ---| ---| ---| ---|
 | 一个 | -1 | [0,2,4,6] | 0 | 1 |
 | 一个 | 0 | [0,2,4,6] | 1 | 1 |
 | x| 2 | []| - | -1 |

 特点`x`没有出现在`s`，所以输出是`-1`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O( | s |
 | 空间| O( | s |

 该解决方案很容易满足问题的限制。 即使输入大小最大，二分搜索和预处理也能保持算法的效率。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    exec(open("solution.py").read())
    return output.getvalue().strip()

# Provided samples
assert run("3\naabce\nace\nabacaba\naax\nty\nyyt\n") == "1\n-1\n3", "sample 1"

# Custom tests
assert run("1\na\naaaaa\n") == "5", "repeat single char"
assert run("1\nabc\nabcabc\n") == "2", "s reused twice"
assert run("1\nxyz\nxyz\n") == "1", "all same length"
assert run("1\nabc\ndef\n") == "-1", "impossible case"
assert run("1\nabc\ncab\n") == "2", "reordering requires multiple ops"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | “a\naaaaa\n” | 5 | 重复相同的字符需要多次追加 |
