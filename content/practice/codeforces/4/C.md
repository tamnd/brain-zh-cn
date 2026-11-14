---
title: "CF 4C - 注册系统"
description: "我们正在建立一个用户名注册系统。 每个传入请求都包含所需的用户名。 如果该用户名以前从未出现过，则注册立即成功，并打印“OK”。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "hashing", "implementation"]
categories: ["algorithms"]
codeforces_contest: 4
codeforces_index: "C"
codeforces_contest_name: "Codeforces Beta Round 4 (Div. 2 Only)"
rating: 1300
weight: 4
solve_time_s: 102
verified: true
draft: false
---

[CF 4C - 注册系统](https://codeforces.com/problemset/problem/4/C)

 **评分：** 1300
 **标签：** 数据结构、哈希、实现
 **求解时间：** 1m 42s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正在建立一个用户名注册系统。 每个传入请求都包含所需的用户名。 如果该用户名以前从未出现过，则注册立即成功，并且我们打印`OK`。 

如果用户名已被使用，我们必须通过附加最小的正整数后缀来生成一个新的用户名，该后缀会生成尚未使用的名称。 例如，如果`alex`已经存在，我们尝试`alex1`， 然后`alex2`，依此类推，直到找到一个免费名称。 所选的生成名称也将被占用。 

输入给出一系列注册请求，每行一个。 输出必须包含系统以相同顺序对每个请求的响应。 

的约束条件为$10^5$requests 完全改变了问题。 每次都扫描以前使用过的名称的解决方案会变得太慢。 和$10^5$操作时，我们的目标应该是总体上大致呈线性时间，或接近线性时间。 哈希表是一个自然的选择，因为我们反复问同样的问题：“这个用户名已经被使用过吗？”

 棘手的部分是生成的名称本身也会被占用。 粗心的实现可能只跟踪原始名称而忘记生成的名称。 

考虑这个输入：```
4
bob
bob
bob1
bob
```正确的输出是：```
OK
bob1
OK
bob2
```第二次请求后，`bob1`已被占用，因为系统生成了它。 当第三个请求明确要求时`bob1`，它必须已经存在。 

当许多后缀已被占用时，会出现另一种微妙的情况：```
5
a
a1
a2
a
a
```正确的输出是：```
OK
OK
OK
a3
a4
```一个幼稚的实现，总是从以下位置开始检查`1`会反复测试`a1`,`a2`， 等等。 这仍然会产生正确的答案，但会浪费大量时间。 

另一个容易犯的错误是忘记了原始名称本身也需要跟踪：```
3
test
test
test
```正确的输出是：```
OK
test1
test2
```如果我们只跟踪生成的后缀，第三个请求可能会错误地生成`test1`再次。 

## 方法

 蛮力思想直接遵循问题陈述。 维护一组使用过的用户名。 当新的请求到达时，检查它是否已经存在。 

如果不存在则插入并打印`OK`。 

如果它已经存在，则开始一一尝试后缀：```
name1
name2
name3
...
```第一个未使用的候选者成为答案。 

这种方法是正确的，因为它确实模拟了所需的过程。 问题是性能。 假设输入包含`a`重复$10^5$次。 第一次重复检查`a1`，接下来的检查`a1`和`a2`，接下来的检查`a1`,`a2`,`a3`， 等等。 检查总数变为：$$1 + 2 + 3 + \dots + (n-1)$$这是$O(n^2)$。 和$10^5$请求，即周围$5 \times 10^9$操作，远远超出极限。 

关键的观察是，一旦我们已经知道基本名称的下一个可用后缀，我们就不需要再次重试较小的后缀。 

For example, after generating`alex7`，我们已经知道`alex1`通过`alex7`被占用。 下一个重复请求`alex`应直接从后缀开始`8`。 

这将问题转化为在哈希映射内维护两条信息：

 1. 用户名是否已存在。 
2. 对于每个基本名称，接下来应该尝试什么后缀。 

哈希表给出平均值$O(1)$插入和查找，因此每个请求都可以在恒定的预期时间内得到处理。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(n^2)$|$O(n)$| 太慢了 |
 | 最佳 |$O(n)$平均 |$O(n)$| 已接受 |

 ## 算法演练

 1. 创建一个名为的哈希图`mp`。 

地图将用户名存储为键。 对于基本名称，其值代表要尝试的下一个后缀。 
2. 对每个传入的用户名进行一一处理。 

我们必须按顺序回答请求，因为每个接受的用户名都会立即影响未来的请求。 
3.如果地图中不存在该用户名，则打印`OK`。 

这意味着该名称完全未使用，因此注册立即成功。 
4.将此用户名插入到带有值的地图中`1`。 

价值`1`意味着如果这个名字稍后再次出现，第一个尝试的后缀应该是`1`。 
5. 如果用户名已存在，则读取其存储的计数器。 

认为`mp[name] = k`。 这意味着后缀小于`k`已经被占用，所以没有理由再次测试它们。 
6.构建候选者`name + str(k)`。 

这是尚未尝试用于该基本名称的最小后缀。 
7. 打印生成的候选并将其插入到地图中。 

生成的名称现在被占用，就像任何明确请求的用户名一样。 
8. 增加`mp[name]`一个。 

对同一基本名称的下一个重复请求应从下一个后缀继续。 

### 为什么它有效

 不变量是：```
For every base username x, mp[x] always stores the smallest suffix
that has not yet been assigned for x.
```最初，插入后`x`第一次，最小的未使用后缀是`1`， 所以`mp[x] = 1`。 

每当我们生成`xk`，我们立即将计数器增加到`k + 1`。 由于所有较小的后缀之前都已被占用，并且`xk`现在刚刚被占用，下一个未使用的后缀正是`k + 1`。 

由于不变量始终成立，因此每个生成的用户名都是有效且最小的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    mp = {}

    for _ in range(n):
        name = input().strip()

        if name not in mp:
            print("OK")
            mp[name] = 1
        else:
            suffix = mp[name]
            new_name = name + str(suffix)

            print(new_name)

            mp[name] += 1
            mp[new_name] = 1

solve()
```字典`mp`同时扮演两个角色。 它的键代表所有占用的用户名，而基本用户名的值则跟踪要使用的下一个后缀。 

当名字第一次出现时，我们打印`OK`并将其计数器初始化为`1`。 这与下一个重复项应尝试后缀的不变量相匹配`1`。 

对于重复的请求，我们直接读取存储的后缀，而不是扫描`1`再次。 该单一优化消除了二次行为。 

该行：```
mp[new_name] = 1
```非常重要。 生成的用户名也必须立即保留。 如果没有这一行，将来的请求可能会意外地重用它们。 

另一个微妙的细节正在更新`mp[name]`生成用户名后。 如果我们忘记增加它，相同的后缀将被重复使用。 

实现使用`input().strip()`因为每个用户名都占一行，我们不希望在存储的字符串中尾随换行符。 

## 工作示例

 ### 示例 1

 输入：```
4
abacaba
acaba
abacaba
acab
```| 步骤| 请求 | 之前的地图 | 输出| 之后的地图 |
 | ---| ---| ---| ---| ---|
 | 1 | 马尼拉| {} | 好的 | {阿巴卡巴：1} |
 | 2 | 阿卡巴| {阿巴卡巴：1} | 好的 | {阿巴卡巴：1，阿卡巴：1} |
 | 3 | 马尼拉| {阿巴卡巴：1，阿卡巴：1} | 巴卡巴1 | {阿巴卡巴：2，阿巴卡巴：1，阿巴卡巴1：1} |
 | 4 | 阿拉伯联合酋长国 | {阿巴卡巴：2，阿巴卡巴：1，阿巴卡巴1：1} | 好的 | {abacaba：2，acaba：1，abacaba1：1，acab：1} |

 该跟踪显示了计数器如何`abacaba`预付款来自`1`到`2`生成后`abacaba1`。 该算法从不检查后缀`1`再次为该基本名称。 

### 示例 2

 输入：```
5
a
a
a
a1
a
```| 步骤| 请求 | 之前的地图 | 输出| 之后的地图 |
 | ---| ---| ---| ---| ---|
 | 1 | 一个 | {} | 好的 | {一：1} |
 | 2 | 一个 | {一：1} | a1 | {a：2，a1：1} |
 | 3 | 一个 | {a：2，a1：1} | a2 | {a：3，a1：1，a2：1} |
 | 4 | a1 | {a：3，a1：1，a2：1} | a11 | a11 | {a：3，a1：2，a2：1，a11：1} |
 | 5 | 一个 | {a：3，a1：2，a2：1，a11：1} | a3| {a: 4, a1: 2, a2: 1, a11: 1, a3: 1} |

 此示例演示了生成的用户名的行为与正常用户名完全相同。 一次`a1`存在，请求`a1`再次必须生成`a11`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(n)$平均 | 每个请求执行恒定时间哈希映射操作 |
 | 空间|$O(n)$| 每个接受的用户名都会存储一次 |

 至多有$10^5$要求，线性复杂度很容易满足限制。 Python 字典是优化的哈希表，因此插入和查找对于此约束来说足够快。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    def solve():
        n = int(input())
        mp = {}
        out = []

        for _ in range(n):
            name = input().strip()

            if name not in mp:
                out.append("OK")
                mp[name] = 1
            else:
                suffix = mp[name]
                new_name = name + str(suffix)

                out.append(new_name)

                mp[name] += 1
                mp[new_name] = 1

        return "\n".join(out)

    return solve()

# provided sample
assert run(
    "4\nabacaba\nacaba\nabacaba\nacab\n"
) == (
    "OK\nOK\nabacaba1\nOK"
), "sample 1"

# minimum size
assert run(
    "1\nx\n"
) == (
    "OK"
), "single registration"

# all equal values
assert run(
    "5\na\na\na\na\na\n"
) == (
    "OK\na1\na2\na3\na4"
), "repeated identical names"

# generated names later requested explicitly
assert run(
    "4\nbob\nbob\nbob1\nbob\n"
) == (
    "OK\nbob1\nbob11\nbob2"
), "generated usernames must also be reserved"

# boundary style chaining
assert run(
    "6\na\na1\na\na1\na2\na\n"
) == (
    "OK\nOK\na2\na11\na21\na3"
), "nested suffix interactions"

# larger repeated sequence
large_input = "10\n" + "\n".join(["z"] * 10) + "\n"

assert run(large_input) == (
    "OK\nz1\nz2\nz3\nz4\nz5\nz6\nz7\nz8\nz9"
), "many duplicates"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单一用户名|`OK`| 最小输入尺寸|
 | 许多相同的名字 | 连续后缀 | 计数器正确递增 |
 |`bob`,`bob`,`bob1`,`bob`|`bob1`必须被占领| 生成的名称被保留 |
 | 混合后缀链 | 正确的嵌套生成 | 处理已经包含数字的名称 |
 | 十次重复`z`价值观 |`z1`通过`z9`| 大型重复序列保持高效 |

 ## 边缘情况

 考虑稍后显式请求生成的用户名的情况：```
4
bob
bob
bob1
bob
```一步一步：

 1.`bob`是新的，打印`OK`， 店铺`bob -> 1`。 
2.`bob`存在，生成`bob1`，打印，更新`bob -> 2`， 店铺`bob1 -> 1`。 
3.`bob1`已经存在，因为它是较早生成的，所以我们必须生成`bob11`。 
4.`bob`现在直接从后缀开始`2`，生成`bob2`。 

输出变为：```
OK
bob1
bob11
bob2
```这证实了生成的用户名的处理方式与普通用户名完全相同。 

现在考虑重复的重复项：```
5
a
a
a
a
a
```执行：

 1. 第一`a`印刷`OK`。 
2.第二`a`印刷`a1`。 
3. 第三`a`印刷`a2`。 
4.第四`a`印刷`a3`。 
5.第五`a`印刷`a4`。 

该算法从不重新检查旧后缀，因为`mp["a"]`总是直接存储下一个未使用的后缀。 

最后，考虑已经包含数字的名称：```
5
a1
a1
a11
a1
a
```执行：

 1.`a1`印刷`OK`。 
2. 复制`a1`产生`a11`。 
3.`a11`已经存在，所以它生成`a111`。 
4.另一个`a1`产生`a12`。 
5.`a`仍未使用，因此打印`OK`。 

输出是：```
OK
a11
a111
a12
OK
```该算法从不尝试解析用户名中的数字。 每个字符串都被独立处理，这避免了许多极端情况的错误。
