---
title: "CF 2039A - Shohag Loves 模组"
description: "我们需要构造一个长度为 $n$ 的递增序列，其中每个值都在 1 到 100 之间。该序列必须满足涉及余数的特殊条件。 对于每个位置 $i$，考虑值 $ai bmod i$。"
date: "2026-06-08T09:55:28+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 2039
codeforces_index: "A"
codeforces_contest_name: "CodeTON Round 9 (Div. 1 + Div. 2, Rated, Prizes!)"
rating: 800
weight: 2039
solve_time_s: 130
verified: false
draft: false
---

[CF 2039A - Shohag Loves Mod](https://codeforces.com/problemset/problem/2039/A)

 **评分：** 800
 **标签：** 构造性算法，数论
 **求解时间：** 2m 10s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们需要构造一个长度递增的序列$n$，其中每个值都在 1 到 100 之间。该序列必须满足涉及余数的特殊条件。 

对于每个位置$i$，考虑值$a_i \bmod i$。 要求是这些余数都不同。 换句话说，如果我们计算$$a_1 \bmod 1,\ a_2 \bmod 2,\ a_3 \bmod 3,\ \ldots,\ a_n \bmod n,$$那么他们中的任何两个都不可能是相等的。 

输入包含多个测试用例。 对于每个测试用例，我们只给出$n$，并且我们必须输出任何有效的递增序列。 

限制非常小。 最大可能值为$n=50$，并且每个元素最多只能为 100。由于该语句保证解决方案始终存在，因此任务实际上是发现一种简单的构造模式，而不是搜索一种模式。 

一个常见的错误是关注值本身而不是其余部分。 例如，递增序列```
1 2 3
```看起来很自然，但是$$1 \bmod 1 = 0,\quad 2 \bmod 2 = 0,\quad 3 \bmod 3 = 0$$因此所有余数都是相同的，这违反了条件。 

另一个简单的陷阱是构造不同的余数，但忘记序列必须严格递增。 例如，对于$n=4$,```
4 3 2 1
```产生不同的余数$$0,1,2,1$$它已经不满足余数条件，并且它也没有增加。 

该问题有趣的部分是找到一种同时自动保证这两个属性的模式。 

## 方法

 暴力思维是生成递增序列并测试所有余数是否不同。 检查候选序列很容易：计算$a_i \bmod i$对于每个索引并验证唯一性。 

困难在于搜索空间。 即使值限制为 100，长度为 50 的递增序列的数量也是巨大的。 穷举搜索是完全不现实的。 

关键的观察结果来自于检查可能的余数的范围。 

对于索引$i$, 余数$a_i \bmod i$必须属于$$0,1,\ldots,i-1.$$如果我们能安排的话$$a_i \bmod i = i-1,$$那么每个索引都会得到不同的余数：$$0,1,2,\ldots,n-1.$$现在任务变得简单多了。 我们只需要一个递增序列，其$i$-th 元素留下余数$i-1$当除以$i$。 

一个非常方便的选择是$$a_i = 2i-1.$$让我们检查一下剩下的部分：$$(2i-1)\bmod i = i-1.$$的确，$$2i-1 = i + (i-1),$$所以除以$i$留下余数$i-1$。 

顺序$$1,3,5,7,\ldots$$是严格递增的，每个余数都不同，并且对于$n \le 50$最大值是$$2\cdot 50 - 1 = 99,$$满足 100 的限制。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 指数| O(n) | 太慢了|
 | 最佳施工| O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 阅读$n$。 
2. 构造序列$$a_i = 2i-1$$对于每一个$i$从 1 到$n$。 
3. 输出生成的值。 

为什么这个选择有效：$$a_i = 2i-1 = i + (i-1),$$所以$$a_i \bmod i = i-1.$$余数变为$$0,1,2,\ldots,n-1,$$这些都是不同的。 

该序列也是严格递增的，因为每一项都比前一项大 2。 

### 为什么它有效

 不变量是位置处的余数$i$正好等于$i-1$。 

由于不同的指数有不同的值$i-1$，没有两个位置可以共享相同的余数。 因此，自动满足所需的成对独特性条件。 

同时，$$a_{i+1}-a_i=(2(i+1)-1)-(2i-1)=2>0,$$所以序列是严格递增的。 最后，最大元素为 99，当$n=50$，保持在允许的范围内。 问题的每个要求都同时得到满足。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())

for _ in range(t):
    n = int(input())
    ans = [str(2 * i - 1) for i in range(1, n + 1)]
    print(" ".join(ans))
```实施直接遵循构建。 

对于每个测试用例，我们生成奇数$$1,3,5,\ldots,2n-1.$$使用列表理解可以使代码简洁并以线性时间运行。 

一个微妙的点是验证上限。 自从$n\le 50$，最大生成值为$99$，因此不需要额外的检查。 

数学证明中的索引从 1 开始，代码通过迭代反映了这一点`i`从 1 到`n`。 这可以避免关联公式时出现相差一的错误$a_i=2i-1$到实施。 

## 工作示例

 ### 示例 1

 输入：```
3
```生成的序列：$$1,\ 3,\ 5$$| 我| a_i | a_i 模我 |
 | --- | --- | --- |
 | 1 | 1 | 0 |
 | 2 | 3 | 1 |
 | 3 | 5 | 2 |

 余数为$0,1,2$，都各不相同。 这证明了核心不变量$a_i \bmod i=i-1$。 

### 示例 2

 输入：```
6
```生成的序列：$$1,\ 3,\ 5,\ 7,\ 9,\ 11$$| 我| a_i | a_i 模我 |
 | --- | --- | --- |
 | 1 | 1 | 0 |
 | 2 | 3 | 1 |
 | 3 | 5 | 2 |
 | 4 | 7 | 3 |
 | 5 | 9 | 4 |
 | 6 | 11 | 11 5 |

 余数构成序列$0,1,2,3,4,5$。 每个余数都是唯一的，并且值严格递增。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 生成并打印 n 个数字 |
 | 空间| O(n) | 打印前存储输出序列 |

 自从$n\le 50$，实际运行时间很小。 即使有 50 个测试用例，也只能生成和打印几千个数字。 该解决方案很容易满足限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    input = sys.stdin.readline

    t = int(input())
    out = []

    for _ in range(t):
        n = int(input())
        out.append(" ".join(str(2 * i - 1) for i in range(1, n + 1)))

    sys.stdout.write("\n".join(out))

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    result = sys.stdout.getvalue()

    sys.stdin = old_stdin
    sys.stdout = old_stdout

    return result

# provided samples (valid output from this construction)
assert run("2\n3\n6\n") == "1 3 5\n1 3 5 7 9 11"

# minimum n
assert run("1\n2\n") == "1 3"

# small odd size
assert run("1\n5\n") == "1 3 5 7 9"

# maximum n
expected = " ".join(str(2 * i - 1) for i in range(1, 51))
assert run("1\n50\n") == expected

# multiple test cases
assert run("3\n2\n3\n4\n") == (
    "1 3\n"
    "1 3 5\n"
    "1 3 5 7"
)
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1\n2\n`|`1 3`| 最小允许尺寸|
 |`1\n5\n`|`1 3 5 7 9`| 一般建筑|
 |`1\n50\n`| 99 以内的奇数 | 最大尺寸和上限 100 |
 |`3\n2\n3\n4\n`| 三个有效序列| 多个测试用例处理 |

 ## 边缘情况

 ### 最小尺寸

 输入：```
1
2
```该算法输出：```
1 3
```余数为$$1\bmod1=0,\qquad 3\bmod2=1.$$它们是不同的，并且顺序是递增的。 这验证了最小的合法输入。 

### 最大尺寸

 输入：```
1
50
```序列变为$$1,3,5,\ldots,99.$$最大值正好是 99，低于 100 的限制。余数为$$0,1,2,\ldots,49.$$一切都是截然不同的。 

### 避免重复的零余数

 一个天真的想法是使用```
1 2 3 4 5
```对于这个序列，$$a_i \bmod i = 0$$对于每个位置，都会立即失败。 

我们的建筑生产```
1 3 5 7 9
```有余数$$0,1,2,3,4,$$所以碰撞完全消失。 

### 公式中相差一的错误

 假设有人错误地选择了$$a_i = 2i.$$为了$n=3$，余数变为$$2\bmod1=0,\quad 4\bmod2=0,\quad 6\bmod3=0.$$所有剩余部分都发生碰撞。 

使用$$a_i=2i-1$$将每个余数精确移至$i-1$，产生所需的不同序列。
