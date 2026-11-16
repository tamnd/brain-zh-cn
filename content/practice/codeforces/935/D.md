---
title: "CF 935D - 法法与古字母"
description: "我们在由符号 1...m 组成的字母表上给出了两个长度相等的单词。 有些位置是已知的，而另一些则被擦除并用 0 表示。每个被擦除的位置都独立且统一地用 m 个字母符号之一填充。"
date: "2026-06-13T03:22:46+07:00"
tags: ["codeforces", "competitive-programming", "math", "probabilities"]
categories: ["algorithms"]
codeforces_contest: 935
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 465 (Div. 2)"
rating: 1900
weight: 935
solve_time_s: 264
verified: true
draft: false
---

[CF 935D - 法法与古字母](https://codeforces.com/problemset/problem/935/D)

 **评级：** 1900
 **标签：** 数学、概率
 **求解时间：** 4m 24s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们在由符号组成的字母表上给出了两个长度相等的单词`1...m`。 一些位置是已知的，而另一些则被删除并由下式表示`0`。 

每个擦除的位置都独立且统一地用其中之一填充`m`字母符号。 After all replacements are made, we obtain two complete words. We must compute the probability that the first word is lexicographically larger than the second.

 答案不需要是分数。 如果概率是$$\frac{P}{Q},$$我们必须打印$$P \cdot Q^{-1} \pmod{10^9+7}.$$自从$m \le 10^5$，分母始终与模数互质$10^9+7$，所以模逆存在。 

单词的长度也可以达到$10^5$。 任何显式枚举已擦除符号分配的算法都是不可能的。 即使是一个未知的位置也已经介绍了$m$可能性，并且在许多未知位置的情况下，完成的数量呈指数级增长。 

时间限制强烈表明线性或接近线性的解决方案。 处理每个位置一次是完全安全的，而任何二次方$n$被排除。 

有几种情况很容易处理不当。 

考虑```
n = 1, m = 2
S1 = [0]
S2 = [1]
```中的未知符号`S1`变成`1`或者`2`。 两种可能性中只有一种会产生更大的单词，所以答案是$1/2$。 贪婪地而不是概率地处理未知位置的解决方案将会失败。 

考虑```
n = 2, m = 3
S1 = [0, 3]
S2 = [0, 1]
```第一个位置不会立即确定比较，因为两个符号都是未知的。 我们必须考虑它们变得相等并继续到第二位置的概率。 忽略“仍然相等”状态会产生不正确的结果。 

考虑```
n = 2, m = 5
S1 = [2, 1]
S2 = [2, 4]
```第一位置是相等且固定的。 第二个位置立即决定比较，答案恰好是零。 一旦遇到固定的不等对，概率转移就应该停止。 

另一个微妙的情况是```
n = 1, m = 5
S1 = [0]
S2 = [0]
```这两个符号均未知。 其中$25$作业，确切地说$10$满足`S1 > S2`。 概率是$$\frac{10}{25}=\frac{2}{5}.$$必须仔细推导两个未知符号的计数公式。 

## 方法

 暴力解决方案将生成两个单词的所有可能的完成，比较结果字符串，计算成功的结果，然后除以结果总数。 

假设有$k$总共删除了位置。 完成数为$m^k$。 和$m=10^5$和$k$可能接近$2\cdot10^5$，这是一个天文数字。 即使对于非常小的值，它也是不可行的。 

关键的观察来自词典比较的工作原理。 

比较两个单词时，只有它们不同的第一个位置很重要。 该位置之后的所有内容都变得无关紧要。 这意味着从左到右扫描时，我们只需要知道一条信息：

 之前所有位置最终结果相同的概率是多少？ 

设这个概率为`same`。 

在某个位置，某些分配的部分会使第一个单词立即变大。 这些结果直接影响最终答案。 另一个分数使两个前缀相等，从而允许比较继续。 

这将问题转化为只有一种状态的简单从左到右概率DP。 

对于每个位置，我们计算：

 1. 该位置做出的概率`S1 > S2`，假设之前所有的位置都相等。 
2. 该位置使它们保持相等的概率。 

第一个数量有助于答案。 第二次数量更新`same`。 

每个位置都可以在恒定时间内独立处理，产生$O(n)$解决方案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(m^k)$|$O(k)$| 太慢了 |
 | 最佳|$O(n)$|$O(1)$| 已接受 |

 ## 算法演练

 让`MOD = 10^9 + 7`。 

让`same`表示到目前为止处理的所有位置都相等的概率。 

最初，$$same = 1.$$让`ans`存储已知第一个单词按字典顺序较大的概率。 

### 1. 预先计算模逆

 我们反复除以`m`和`m²`，所以计算$$inv_m = m^{-1} \pmod{MOD}.$$### 2.从左到右扫描位置

 对于每个位置，检查该对`(a[i], b[i])`。 

贡献取决于四种情况。 

### 3. 两个符号都是已知的

 如果两个值都是固定的：

 如果`a[i] > b[i]`，然后由 表示的每个作业`same`变得成功。 

添加`same`到答案并停止。 

如果`a[i] < b[i]`，成功变得不可能，我们停下来。 

如果它们相等，则继续。 

### 4.第一个符号未知，第二个符号已知

 假设`a[i]=0`和`b[i]=x`。 

其中`m`的可能值`a[i]`:`m-x`值大于`x`。 

所以这个位置立即给出的概率`S1>S2`是$$\frac{m-x}{m}.$$添加$$same \cdot \frac{m-x}{m}$$到答案。 

只有一个值保持相等，即`a[i]=x`。 

更新$$same \leftarrow same \cdot \frac1m.$$### 5. 第一个已知，第二个未知

 假设`a[i]=x`和`b[i]=0`。 

其中`m`选择`b[i]`:`x-1`值小于`x`。 

因此这个位置的概率`S1>S2`等于$$\frac{x-1}{m}.$$添加$$same \cdot \frac{x-1}{m}.$$只有一个值可以保持平等，所以再一次$$same \leftarrow same \cdot \frac1m.$$### 6. 两个符号均未知

 有$m^2$同等可能的任务。 

第一个符号大于第二个符号的对的数量是$$\frac{m(m-1)}2.$$因此这个位置立即产生的概率`S1>S2`是$$\frac{m(m-1)/2}{m^2} = \frac{m-1}{2m}.$$添加$$same \cdot \frac{m(m-1)/2}{m^2}.$$平等恰好发生在`m`作业，所以$$same \leftarrow same \cdot \frac1m.$$### 7. 完成扫描

 如果所有位置保持相等，则单词相等并且对概率没有贡献。 

输出`ans`。 

### 为什么它有效

 每一步，`same`等于随机替换后所有先前处理的位置都相等的概率。 

词典比较仅取决于单词不同的第一个位置。 处理职位时，每个结果都恰好属于以下三类之一：

 1.第一个字变大。 
2.第二个字变大。 
3. 地位保持平等。 

第一类永远有助于最终答案。 第二类以后永远无法贡献。 第三类是唯一一个让未来的位置变得重要的类别，因此它的概率成为`same`。 

由于这些类别划分了所有可能的分配，并且每个位置都是在所有较早位置相等的条件下处理的，因此累积的概率正是第一个单词按字典顺序更大的概率。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 1000000007

def main():
    n, m = map(int, input().split())
    a = list(map(int, input().split()))
    b = list(map(int, input().split()))

    inv_m = pow(m, MOD - 2, MOD)
    inv_m2 = inv_m * inv_m % MOD
    inv2 = (MOD + 1) // 2

    same = 1
    ans = 0

    for x, y in zip(a, b):
        if x == 0 and y == 0:
            greater_pairs = m * (m - 1) // 2
            ans = (ans + same * (greater_pairs % MOD) % MOD * inv_m2) % MOD
            same = same * inv_m % MOD

        elif x == 0:
            ans = (ans + same * (m - y) % MOD * inv_m) % MOD
            same = same * inv_m % MOD

        elif y == 0:
            ans = (ans + same * (x - 1) % MOD * inv_m) % MOD
            same = same * inv_m % MOD

        else:
            if x > y:
                ans = (ans + same) % MOD
                break
            elif x < y:
                break

    print(ans)

if __name__ == "__main__":
    main()
```变量`same`是算法的中心状态。 它始终表示每个已处理位置最终相等的概率。 

这三个概率案例直接对应于演练中的计数参数。 由于所有算术都是模数执行的`MOD`，除法被模逆乘法取代。 

有两个未知符号的情况值得特别注意。 有序对的数量`(u,v)`满意的`u>v`不是`m²/2`。 必须首先排除相等的对。 正确的计数是$$1+2+\cdots+(m-1)=\frac{m(m-1)}2.$$另一个微妙的细节是当两个固定符号不同时停止。 一旦知道第一个不同的位置，后面的位置就永远不会影响词​​典编排结果。 

## 工作示例

 ### 示例 1

 输入```
1 2
0
1
```| 职位| 一个[我] | b[i] | 之前也一样| 贡献 | | 之后同样 回答 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 1 | 0 | 1 | 1 | (2-1)/2 = 1/2 | 1/2 | 1/2 1/2 | 1/2

 唯一的未知符号可以是`1`或者`2`。 恰好一个选择产生一个更大的单词，所以概率是$1/2$。 

### 示例 2

 输入```
2 3
0 3
0 1
```| 职位| 一个[我] | b[i] | 之前也一样| 贡献 | | 之后同样 回答 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 1 | 0 | 0 | 1 | 3/9 = 1/3 | 1/3 | 1/3 1/3 | 1/3
 | 2 | 3 | 1 | 1/3 | 1/3 1/3 | 1/3 停止| 2/3 |

 在第一个位置，所有作业的三分之一已经满足`S1>S2`。 另外三分之一使第一个符号相等，从而允许第二个位置决定。 自从`3>1`，所有剩余概率相加，给出$2/3$。 

该跟踪演示了关键的不变量：`same`始终表示存活到未来位置的概率质量。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n)$| 每个位置被处理一次 |
 | 空间|$O(1)$| 仅维护少数变量 |

 和$n \le 10^5$，线性扫描很容易足够快。 无论输入大小如何，内存使用量都保持不变。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

MOD = 1000000007

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    n, m = map(int, input().split())
    a = list(map(int, input().split()))
    b = list(map(int, input().split()))

    inv_m = pow(m, MOD - 2, MOD)
    inv_m2 = inv_m * inv_m % MOD

    same = 1
    ans = 0

    for x, y in zip(a, b):
        if x == 0 and y == 0:
            greater_pairs = m * (m - 1) // 2
            ans = (ans + same * (greater_pairs % MOD) % inv_m2) % MOD
            same = same * inv_m % MOD

        elif x == 0:
            ans = (ans + same * (m - y) % MOD * inv_m) % MOD
            same = same * inv_m % MOD

        elif y == 0:
            ans = (ans + same * (x - 1) % MOD * inv_m) % MOD
            same = same * inv_m % MOD

        else:
            if x > y:
                ans = (ans + same) % MOD
                break
            elif x < y:
                break

    return str(ans)

# provided sample
assert run("1 2\n0\n1\n") == "500000004"

# minimum size, fixed equal symbols
assert run("1 5\n3\n3\n") == "0"

# minimum size, fixed greater
assert run("1 5\n4\n2\n") == "1"

# both unknown, m=2 => probability 1/4
assert run("1 2\n0\n0\n") == "250000002"

# fixed equal prefix, later position decides
assert run("2 5\n2 5\n2 1\n") == "1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 5 / 3 / 3`|`0`| 同等的话永远不算数|
 |`1 5 / 4 / 2`|`1`| 立即定胜|
 |`1 2 / 0 / 0`|`250000002`| 正确计数两个未知符号 |
 |`2 5 / 2 5 / 2 1`|`1`| 等前缀后跟固定决定位置 |

 ## 边缘情况

 考虑```
1 2
0
0
```有四种同样可能的任务：```
(1,1)
(1,2)
(2,1)
(2,2)
```仅有的`(2,1)`满足`S1>S2`，所以概率是`1/4`。 该算法计算$$\frac{2(2-1)/2}{2^2} = \frac14,$$与确切的计数相匹配。 

考虑```
2 5
2 1
2 4
```第一个符号相等，因此处理继续。 在第二个位置上，`1<4`，这意味着第一个不同的位置已经支持第二个单词。 该算法立即停止并返回零。 

考虑```
2 3
0 3
0 1
```第一个位置将概率质量贡献给三个组：较大、较小和相等。 只有势均力敌的小组才能进入第二名。 更新内容$$same \leftarrow same \cdot \frac13$$准确地捕捉到了生存概率。 当处理第二个位置时，每个幸存的分配都会获胜，因为`3>1`。 

这些例子说明了基本的不变量：`same`总是等于所有前面的位置保持相等的概率，这正是后面的位置影响词典比较所需的条件。
