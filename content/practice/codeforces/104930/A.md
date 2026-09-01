---
title: "CF 104930A - 向上 向上 向下 向下"
description: "我们得到了 11 个单词的固定序列，每个单词代表游戏作弊代码中的一个按钮按下。 另外，还有一个已知的参考序列，即 Konami 代码，其长度也是 11 个输入。"
date: "2026-06-28T07:51:19+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104930
codeforces_index: "A"
codeforces_contest_name: "UTPC Contest 01-26-24 Div. 2 (Beginner)"
rating: 0
weight: 104930
solve_time_s: 58
verified: true
draft: false
---

[CF 104930A - 上上下下](https://codeforces.com/problemset/problem/104930/A)

 **评级：** -
 **标签：** -
 **求解时间：** 58s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了 11 个单词的固定序列，每个单词代表游戏作弊代码中的一个按钮按下。 另外，还有一个已知的参考序列，即 Konami 代码，其长度也是 11 个输入。 

任务不是检查给定的序列是否与 Konami 代码完全匹配，而是逐个位置比较它们并计算有多少个位置匹配。 如果输入中该索引处的字符串与 Konami 代码中的相应字符串相同，则该位置对分数有贡献。 

输入大小是恒定的：正好 11 个字符串，每个字符串的长度为 100。这意味着数据总量非常小。 任何从 O(1) 到 O(n) 且常量较大的算法在这里都非常快，但结构表明我们应该专注于直接比较，而不需要任何预处理或复杂的数据结构。 

边缘情况主要与字符串相等行为有关。 由于比较区分大小写且精确，因此即使是微小的差异（例如额外字符或不同单词）也必须视为不匹配。 

值得注意的一个微妙的情况是，当所有字符串匹配时，它应该返回 11，当没有匹配时，它应该返回 0。另一个是部分重叠，其中只有几个位置匹配，我们必须确保我们计算每个索引的相等性，而不是基于集合的相等性。 使用集合比较或排序会破坏位置信息并给出不正确的结果。 

## 方法

 强力解释是将每个输入字符串与 Konami 代码中的每个位置进行比较，但这是不必要的，因为该结构已经一对一地对齐位置。 即使我们将其写为嵌套循环，我们仍然最多只能执行 11 × 11 次比较，这是可以忽略不计的。 

关键的观察结果是，问题简化为对对齐数组的单次传递：在索引 i 处，我们将 input[i] 与 target[i] 进行比较，如果它们匹配，则递增计数器。 位置之间没有依赖性，不需要散列，也不需要数据转换。 

蛮力思想之所以有效，是因为直接比较就足够了，但它在概念上是多余的，因为每个输入位置都有一个对应的目标位置。 最佳解决方案将所有内容折叠成单个线性扫描。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力（双循环比较）| O(11²) | O(1) | O(1) | 已接受 |
 | 最优（单遍比较）| O(11) | O(1) | O(1) | 已接受 |

 ## 算法演练

 ### Konami 参考序列

 我们将参考代码视为固定数组：`["up","up","down","down","left","right","left","right","b","a","start"]`### 步骤

 1.将11个输入字符串读入数组`s`。 

这保留了位置结构，这很重要，因为匹配取决于索引对齐。 
2. 定义参考数组`t`作为 Konami 代码序列。 

这避免了在比较期间重新计算或重新解析引用。 
3. 初始化计数器`score = 0`。 

该变量累积匹配位置的数量。 
4. 迭代索引`i`从 0 到 10。 

每个索引代表作弊代码序列中的固定按钮位置。 
5. 对于每个索引`i`， 比较`s[i]`和`t[i]`。 

如果它们与字符串完全相同，则递增`score`。 
6. 完成全部11个位置后，输出`score`。 

### 为什么它有效

 输入中的每个位置恰好对应于参考序列中的一个固定位置。 该算法计算每个索引的相等性测试，并且每个测试独立地对最终计数做出贡献。 由于没有位置会影响另一个位置，因此将每个位置的匹配相加即可得出作弊分数的准确定义。 问题允许的匹配没有其他解释，因此计数既完整又正确。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    ref = ["up", "up", "down", "down", "left", "right", "left", "right", "b", "a", "start"]
    s = input().split()
    
    score = 0
    for i in range(11):
        if s[i] == ref[i]:
            score += 1
    
    print(score)

if __name__ == "__main__":
    solve()
```该解决方案使用一次读取整行`split()`，这是安全的，因为输入格式保证恰好有 11 个由空格分隔的标记。 

参考数组是硬编码的，因为它是固定的并且不依赖于输入。 这避免了不必要的计算或字符串操作。 

该循环严格限制为 11 次迭代，确保恒定时间执行。 比较使用直接字符串相等，这是这里最有效和最正确的操作。 

## 工作示例

 ### 示例 1

 输入：```
up up down down left right left right b a start
```| 我| 输入 s[i] | 参考 t[i] | 比赛| 分数 |
 | ---| ---| ---| ---| ---|
 | 0 | 向上 | 向上 | 是的 | 1 |
 | 1 | 向上 | 向上 | 是的 | 2 |
 | 2 | 下| 下| 是的 | 3 |
 | 3 | 下| 下| 是的 | 4 |
 | 4 | 左| 左| 是的 | 5 |
 | 5 | 对| 对| 是的 | 6 |
 | 6 | 左| 左| 是的 | 7 |
 | 7 | 对| 对| 是的 | 8 |
 | 8 | 乙| 乙| 是的 | 9 |
 | 9 | 一个 | 一个 | 是的 | 10 | 10
 | 10 | 10 开始 | 开始 | 是的 | 11 | 11

 最终输出为 11，确认了所有位置的完美匹配。 

### 示例 2

 输入：```
up down up down right left right left a b stop
```| 我| 输入 s[i] | 参考 t[i] | 比赛| 分数 |
 | ---| ---| ---| ---| ---|
 | 0 | 向上 | 向上 | 是的 | 1 |
 | 1 | 下| 向上 | 没有| 1 |
 | 2 | 向上 | 下| 没有| 1 |
 | 3 | 下| 下| 是的 | 2 |
 | 4 | 对| 左| 没有| 2 |
 | 5 | 左| 对| 没有| 2 |
 | 6 | 对| 左| 没有| 2 |
 | 7 | 左| 对| 没有| 2 |
 | 8 | 一个 | 乙| 没有| 2 |
 | 9 | 乙| 一个 | 没有| 2 |
 | 10 | 10 停止| 开始 | 没有| 2 |

 最终输出为 2，仅匹配位置 0 和 3。 

这些痕迹表明，评分严格取决于位置平等而不是成员资格或频率。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(11) | 一次遍历 11 个元素的固定长度数组 |
 | 空间| O(1) | O(1) | 只有恒定数量的变量和固定的引用数组 |

 无论输入内容如何，​​运行时间都是恒定的，这远远低于任何实际限制。 内存使用量也是恒定的，因为没有动态结构随输入大小而扩展。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import builtins
    return str(__import__('builtins').print.__self__ if False else __import__('builtins'))  # placeholder
```正确的测试工具通常会调用`solve()`直接地; 假设该结构：```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    import io as sio

    out = sio.StringIO()
    with redirect_stdout(out):
        solve()
    return out.getvalue().strip()

# provided samples
assert run("up up down down left right left right b a start") == "11"
assert run("up down up down right left right left a b stop") == "2"

# custom cases
assert run("up up down down left right left right b a start") == "11"
assert run("down down down down down down down down down down down") == "2"
assert run("left left left left left left left left left left left"
```
