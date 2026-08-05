---
title: "CF 102606I - 愚蠢的后缀数组"
description: "直接的方法是尝试构建候选字符串，生成其所有后缀，对它们进行排序，然后检查原始后缀是否具有所需的排名。 这是正确的，因为它完全遵循后缀数组的定义。"
date: "2026-08-04T17:07:45+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102606
codeforces_index: "I"
codeforces_contest_name: "2020 ECNU Campus Online Invitational Contest"
rating: 0
weight: 102606
solve_time_s: 73
verified: true
draft: false
---

[CF 102606I - 愚蠢的后缀数组](https://codeforces.com/problemset/problem/102606/I)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 13s
 **已验证：** 是的

 ## 解决方案
 ## 方法

 直接的方法是尝试构建候选字符串，生成其所有后缀，对它们进行排序，然后检查原始后缀是否具有所需的排名。 这是正确的，因为它完全遵循后缀数组的定义。 然而，它没有提供任何有用的方法来搜索可能的字符串的巨大空间。 有`n`后缀，生成它们可能已经需要`O(n^2)`记忆，因为它们的总长度是二次的。 为了`n = 100000`，最坏的情况将涉及大约 50 亿个字符位置来存储所有后缀。 

关键的观察是我们不需要构建后缀数组。 我们只需要强制后缀之间进行比较。 

假设答案的第一个字符是`'b'`。 任何以以下开头的后缀`'a'`将自动变小，而任何以大于的字符开头的后缀`'b'`会自动变大。 这提供了一种确定排名的简单方法。 

我们可以准确地把`k - 1`第一个位置之后的后缀`'a'`。 这些后缀都将出现在整个字符串之前。 然后我们让剩下的每个后缀都以`'c'`，所以它们都在整个字符串之后。 

该字符串变为：```
b + (k-1 times 'a') + (n-k times 'c')
```从内部开始的后缀`a`块较小，因为它们的第一个字符是`'a'`。 从内部开始的后缀`c`块更大，因为它们的第一个字符是`'c'`。 整个字符串是唯一以以下开头的后缀`'b'`，所以它正好位于`k-1`较小的后缀。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) 或更糟 | O(n²) | 太慢了|
 | 最佳| O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 阅读`n`和`k`。 答案的第一个字符将是`'b'`，因为我们希望使用字典顺序将较小的后缀与较大的后缀分开。 
2. 追加`k - 1`的副本`'a'`。 该块内开始的每个后缀都以`'a'`，所以它比第一个字符是的完整字符串小`'b'`。 这些正是应该出现在答案之前的后缀。 
3. 追加`n - k`的副本`'c'`。 该块内开始的每个后缀都以`'c'`，所以它比整个字符串大。 这些后缀将出现在答案之后。 
4. 输出构造好的字符串。 

为什么有效：后缀分为三组。 第一组包括`k - 1`开头的后缀`a`块，并且每一个都比整个字符串小。 第二组是从index开始的后缀`0`，开始于`b`。 第三组由以`c`块，并且它们都更大。 由于没有其他后缀以`b`，完整的字符串正好有`k - 1`前面有后缀。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, k = map(int, input().split())
    ans = ['b']
    ans.append('a' * (k - 1))
    ans.append('c' * (n - k))
    print(''.join(ans))

if __name__ == "__main__":
    solve()
```第一个附加创建我们想要排名的后缀。 下一个附加恰好添加输入所需的较小后缀的数量。 最后的追加将用保证使其后缀更大的字符填充剩余位置。 

计算`k - 1`是重要的边界细节。 完整字符串本身不计入其之前的后缀中，因此只有位置零之后的后缀可以对较小的计数做出贡献。 

什么时候`k = 1`，中间块的长度为零，答案是`b`其次是`c`人物。 什么时候`k = n`，最后一个块消失，所有后面的后缀都以`a`，使整个字符串成为最大的后缀。 

## 工作示例

 对于样本 1，`n = 4`,`k = 2`。 

| 步骤| 已建部分 | 当前字符串|
 | --- | --- | --- |
 | 开始| 第一个字符 |`b`|
 | 添加`k-1 = 1`的副本`a`| 添加更小的后缀 来源 |`ba`|
 | 添加`n-k = 2`的副本`c`| 添加更大的后缀来源|`bacc`|

 后缀是：

 | 后缀位置 | 后缀 | 比较|
 | --- | --- | --- |
 | 0 |`bacc`| 目标后缀 |
 | 1 |`acc`| 较小|
 | 2 |`cc`| 更大|
 | 3 |`c`| 更大|

 只有一个后缀较小，因此整个字符串具有排名`2`。 

对于样本 2，`n = 8`,`k = 3`。 

| 步骤| 已建部分 | 当前字符串|
 | --- | --- | --- |
 | 开始| 第一个字符 |`b`|
 | 添加`k-1 = 2`的副本`a`| 添加更小的后缀 来源 |`baa`|
 | 添加`n-k = 5`的副本`c`| 添加更大的后缀来源|`baaccccc`|

 从位置开始的后缀`1`和`2`是`aaccccc`和`accccc`，都小于整个字符串。 后面的所有后缀都以`c`，所以它们更大。 完整的字符串前面正好有两个后缀，给出排名`3`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 该算法准确地创建了`n`人物。 |
 | 空间| O(n) | 输出字符串需要线性存储。 |

 最大可能的输入有`100000`字符，因此线性结构很容易符合限制。 不存储或比较后缀。 

## 测试用例```python
import sys
import io

def make_solution(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    n, k = map(int, sys.stdin.readline().split())
    ans = ['b']
    ans.append('a' * (k - 1))
    ans.append('c' * (n - k))
    print(''.join(ans))

    result = sys.stdout.getvalue().strip()
    sys.stdin = old_stdin
    sys.stdout = old_stdout
    return result

def rank_of_string(s):
    suffixes = sorted(s[i:] for i in range(len(s)))
    return suffixes.index(s) + 1

assert rank_of_string(make_solution("4 2")) == 2, "sample 1"
assert rank_of_string(make_solution("8 3")) == 3, "sample 2"

assert rank_of_string(make_solution("1 1")) == 1, "minimum size"
assert rank_of_string(make_solution("5 5")) == 5, "largest rank"
assert rank_of_string(make_solution("10 1")) == 1, "smallest rank"
assert rank_of_string(make_solution("100000 50000")) == 50000, "large input"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1`| 任何单字符字符串 | 处理单个后缀大小写 |
 |`5 5`| 具有四个较小后缀的字符串 | 检查最大可能的排名 |
 |`10 1`| 没有更小的后缀的字符串 | 检查可能的最小排名 |
 |`100000 50000`| 秩`50000`| 确认线性构造尺度 |

 ## 边缘情况

 对于`n = 5, k = 5`，算法创建`baaaa`。 第一个位置之后的后缀是`aaaa`,`aaa`,`aa`， 和`a`。 它们都较小，因为它们开始于`a`。 有四个较小的后缀，因此完整的字符串是第五个。 

为了`n = 4, k = 1`，算法创建`bccc`。 后缀是`bccc`,`ccc`,`cc`， 和`c`。 第一个后缀之后的每个后缀都以`c`，大于`b`，所以完整的字符串是第一个。 

为了`n = 1, k = 1`，算法创建`b`。 没有其他后缀，因此唯一的后缀排名第一。 该结构自然地处理这个问题，因为两个重复块的长度都为零。
