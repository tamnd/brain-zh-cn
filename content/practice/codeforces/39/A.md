---
title: "CF 39A - C*++ 计算"
description: "我们得到一个由涉及单个变量 a 的项构建的算术表达式。 每个术语都是以下两种形式之一："
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "expression-parsing", "greedy"]
categories: ["algorithms"]
codeforces_contest: 39
codeforces_index: "A"
codeforces_contest_name: "School Team Contest 1 (Winter Computer School 2010/11)"
rating: 2000
weight: 39
solve_time_s: 162
verified: true
draft: false
---
[CF 39A - C*++ 计算](https://codeforces.com/problemset/problem/39/A)

 **评级：** 2000
 **标签：** 表达式解析，贪心
 **求解时间：** 2m 42s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个由涉及单个变量的项构建的算术表达式`a`。 每个术语都是以下两种形式之一：```
k * a++
k * ++a
```在哪里`k`是一个整数系数`0`和`1000`。 如果系数缺失，则将其视为`1`。 

整个表达式是这些项的和与减。 不寻常的部分是评估顺序。 该语言允许在将术语与以下术语组合之前以任何顺序对其进行评估`+`和`-`。 

每一项都会改变以下值`a`。 

为了`a++`，当前值`a`首先使用，然后`a`增加了`1`。 

为了`++a`,`a`首先增加，然后使用新值。 

任务是选择使整个表达式的最终值最大化的求值顺序。 

被加数的个数最多为`1000`，因此任何比二次慢得多的算法都是不必要的。 尝试每一种排列是不可能的，因为`1000!`是一个天文数字。 即使只是为了`15`就目前而言，暴力破解已经变得不可行了。 

表达式本身足够小，可以直接使用线性扫描对其进行解析。 我们只需要提取每个被加数：```
sign: +1 or -1
coefficient: k
type: post-increment or pre-increment
```一些边缘情况很容易被错误处理。 

考虑：```
0
a++-++a
```如果我们评估`a++`第一的：```
0 - 2 = -2
```如果我们评估`++a`第一的：```
1 - 1 = 0
```最大值为`0`。 只计算总增量而不考虑顺序的简单方法会失去这种区别。 

另一个微妙的情况是系数`0`。 

输入：```
5
0*a++-0*++a
```这两个术语都有贡献`0`数字上，但他们仍然修改`a`。 读完后第一项增加`a`，第二个在读取之前增加。 即使系数为零，顺序仍然很重要。 

第三个陷阱是忘记减法会翻转优先级。 

输入：```
1
10*a++-1*++a
```为了最大化结果，大的正系数应该看到一个大的值`a`，而负项应该看到一个很小的值。 首先评估负面术语会更好。 

粗心的贪心算法仅按系数大小排序而不考虑符号会给出错误的结果。 

## 方法

 蛮力的想法是直接的。 解析所有被加数，生成每个可能的求值顺序，模拟表达式，并保留最大结果。 

对于每个排列，我们维持当前值`a`。 评估一个术语时：

 对于`k * a++`，我们添加`k * a`到结果，然后递增`a`。 

为了`k * ++a`，我们增加`a`首先，然后添加`k * a`。 

评估所有术语后，我们将它们与原始术语结合起来`+`和`-`迹象。 

这是有效的，因为语言语义是通过顺序评估精确描述的。 问题是排列的数量。 和`n`加法，我们需要`n!`订单。 甚至`12!`已经是关于`4.8 * 10^8`，远远超出了极限。 

关键的观察是每一项都会增加`a`正好一次。 唯一的问题是哪些项应该接收较小的值`a`，并且哪个应该接收更大的。 

让我们仔细重写每个术语。 

假设当前`a = x`。 

对于积极的术语：```
+k * a++  =>  +k * x
+k * ++a  =>  +k * (x + 1)
```对于否定词：```
-k * a++  =>  -k * x
-k * ++a  =>  -k * (x + 1)
```每一项都线性依赖于当前值`a`。 

如果一项的有效系数较大`x`，我们希望稍后对其进行评估`a`变得更大。 如果它的系数较小，我们希望更早。 

这成为经典的成对交换论证。 

取两项有效系数`c1`和`c2`。 

如果我们在第 2 项之前评估第 1 项：```
c1 * x + c2 * (x + 1)
```如果我们交换它们：```
c2 * x + c1 * (x + 1)
```在以下情况下，第二个顺序更好：```
c1 > c2
```因此应按有效系数的非递减顺序处理项。 

现在我们只需要确定每个被加数的有效系数。 

为了：```
+k * something
```有效系数为`+k`。 

为了：```
-k * something
```有效系数为`-k`。 

这`++a`相对`a++`区别仅提供恒定的偏移。 具体来说，`++a`添加其带符号系数的一份额外副本，因为它在读取之前会递增。 

排序后，我们按该顺序模拟评估。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n!·n) | O(n!·n) | O(n) | 太慢了 |
 | 最佳 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 将表达式解析为单独的被加数。 

对于每个被加数，提取：

 - 它的标志，`+1`或者`-1`- 其系数`k`- 是否是`a++`或者`++a`2. 对于每个被加数，计算其有效系数。 

积极的术语有贡献`+k * current_a`。 

负项有贡献`-k * current_a`。 

店铺：```
effective = sign * k
```3. 对所有被加数进行排序`effective`按非递减顺序。 

较小的系数应消耗较小的值`a`。 较大的系数应消耗较大的值`a`。 
4. 按排序顺序模拟评估。 

维护：

 - 当前值`a`- 累计答案
 5、加工时`a++`：

添加：```
sign * k * a
```然后增加`a`。 
6、加工时`++a`：

 增量`a`首先，然后添加：```
sign * k * a
```7. 输出最终累加值。 

### 为什么它有效

 每学期都会增加`a`恰好一次，所以在评估之后`t`条件下，当前值`a`无论顺序如何都是固定的。 

唯一的自由是决定哪个术语接受哪个阶段`a`。 

考虑具有有效系数的两个相邻项`c1`和`c2`。 

如果当前`a = x`，将它们评估为`(1,2)`给出：```
c1*x + c2*(x+1)
```交换它们可以得到：```
c2*x + c1*(x+1)
```当第二个表达式更大时`c1 > c2`。 

因此，任何较大系数较早出现的反演都可以通过交换来改进。 重复此参数会将任何最佳排序转换为排序顺序。 

这证明了贪心顺序是全局最优的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    a = int(input())
    s = input().strip()

    terms = []

    i = 0
    sign = 1

    while i < len(s):
        if s[i] == '+':
            sign = 1
            i += 1
        elif s[i] == '-':
            sign = -1
            i += 1

        coeff = 0
        has_coeff = False

        while i < len(s) and s[i].isdigit():
            coeff = coeff * 10 + int(s[i])
            has_coeff = True
            i += 1

        if has_coeff:
            i += 1  # skip '*'
        else:
            coeff = 1

        if s[i:i + 3] == "++a":
            typ = 1
            i += 3
        else:
            typ = 0
            i += 3

        effective = sign * coeff
        terms.append((effective, sign, coeff, typ))

    terms.sort(key=lambda x: x[0])

    ans = 0
    cur = a

    for _, sign, coeff, typ in terms:
        if typ == 1:
            cur += 1
            ans += sign * coeff * cur
        else:
            ans += sign * coeff * cur
            cur += 1

    print(ans)

solve()
```解析器从左到右扫描表达式。 每次迭代仅提取一个被加数。 

系数解析需要特别小心，因为系数可能会被省略。 如果没有找到数字，则系数必须变为`1`。 

之间的区别`++a`和`a++`表示为`typ`。```
typ = 1  -> ++a
typ = 0  -> a++
```排序键仅为有效系数：```
sign * coeff
```这是控制一个项是否更喜欢较早或较晚的值的数量`a`。 

在模拟过程中，增量顺序很重要。 为了`++a`，增量发生在贡献之前。 为了`a++`，贡献发生在增量之前。 混合这两种情况是最常见的实现错误。 

Python 整数会自动安全地处理所有可能的值，因此不必担心溢出。 

## 工作示例

 ### 示例 1

 输入：```
1
5*a++-3*++a+a++
```解析的术语：

 | 术语 | 有效|

 |---|---|---|

 |`5*a++`|`5`|

 |`-3*++a`|`-3`|

 |`a++`|`1`|

 排序顺序：```
-3*++a
a++
5*a++
```模拟：

 | 步骤| 术语 | 之前 | 贡献 | 后| 总计 |
 | --- | --- | --- | --- | --- | --- |
 | 1 |`-3*++a`| 1 |`-3 * 2 = -6`| 2 | -6 |
 | 2 |`a++`| 2 |`2`| 3 | -4 |
 | 3 |`5*a++`| 3 |`15`| 4 | 11 | 11

 最终答案：```
11
```这个例子演示了主要的贪心思想。 首先评估负系数，因此它接收到的最小可能值`a`。 

### 示例 2

 输入：```
3
a+++a++
```解析的术语：

 | 术语 | 有效|
 | --- | --- |
 |`a++`|`1`|
 |`a++`|`1`|

 任何顺序都是等效的。 

模拟：

 | 步骤| 术语 | 之前 | 贡献 | 后| 总计 |
 | --- | --- | --- | --- | --- | --- |
 | 1 |`a++`| 3 | 3 | 4 | 3 |
 | 2 |`a++`| 4 | 4 | 5 | 7 |

 最终答案：```
7
```这证实了相等的系数可以以任何顺序出现而不改变结果。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 对被加数进行排序占主导地位
 | 空间| O(n) | 存储已解析的术语 |

 至多有`1000`加数，`O(n log n)`很容易足够快。 内存使用量很小，因为我们每个术语只存储几个整数。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    def solve():
        a = int(input())
        s = input().strip()

        terms = []

        i = 0
        sign = 1

        while i < len(s):
            if s[i] == '+':
                sign = 1
                i += 1
            elif s[i] == '-':
                sign = -1
                i += 1

            coeff = 0
            has_coeff = False

            while i < len(s) and s[i].isdigit():
                coeff = coeff * 10 + int(s[i])
                has_coeff = True
                i += 1

            if has_coeff:
                i += 1
            else:
                coeff = 1

            if s[i:i + 3] == "++a":
                typ = 1
                i += 3
            else:
                typ = 0
                i += 3

            effective = sign * coeff
            terms.append((effective, sign, coeff, typ))

        terms.sort(key=lambda x: x[0])

        ans = 0
        cur = a

        for _, sign, coeff, typ in terms:
            if typ == 1:
                cur += 1
                ans += sign * coeff * cur
            else:
                ans += sign * coeff * cur
                cur += 1

        print(ans)

    out = io.StringIO()
    old_stdout = sys.stdout
    sys.stdout = out

    solve()

    sys.stdout = old_stdout
    return out.getvalue()

# provided sample
assert run("1\n5*a++-3*++a+a++\n") == "11\n", "sample 1"

# minimum size
assert run("0\na++\n") == "0\n", "single term"

# ordering with negative coefficient
assert run("0\na++-++a\n") == "0\n", "negative term should go first"

# zero coefficients still increment
assert run("5\n0*a++-0*++a\n") == "0\n", "zero coefficient behavior"

# equal coefficients
assert run("3\na+++a++\n") == "7\n", "equal priorities"

# larger coefficients later
assert run("1\n10*a++-1*a++\n") == "19\n", "sorting correctness"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`0\na++`|`0`| 单加数解析 |
 |`0\na++-++a`|`0`| 负面条款宜早|
 |`5\n0*a++-0*++a`|`0`| 零系数仍然会改变`a`|
 |`3\na+++a++`|`7`| 等有效系数|
 |`1\n10*a++-1*a++`|`19`| 贪心排序 |

 ## 边缘情况

 考虑：```
0
a++-++a
```解析出的有效系数为：```
1
-1
```排序顺序：```
-++a
a++
```模拟：

 | 步骤| 术语 | 之前 | 贡献 | 后| 总计 |
 | --- | --- | --- | --- | --- | --- |
 | 1 |`-++a`| 0 | -1 | 1 | -1 |
 | 2 |`a++`| 1 | 1 | 2 | 0 |

 最终答案：```
0
```该算法正确地将负系数放在第一位，因此它接收到的最小可能值`a`。 

现在考虑零系数：```
5
0*a++-0*++a
```尽管两项数值贡献均为零，但两项仍会递增`a`。 

排序后的有效系数：```
0
0
```模拟：

 | 步骤| 术语 | 之前 | 贡献 | 后| 总计 |
 | --- | --- | --- | --- | --- | --- |
 | 1 |`0*a++`| 5 | 0 | 6 | 0 |
 | 2 |`-0*++a`| 6 | 0 | 7 | 0 |

 最终答案依然存在`0`。 

这个案例证实了该实现独立于算术贡献来处理副作用。 

最后，考虑：```
1
10*a++-1*a++
```有效系数：```
10
-1
```排序顺序：```
-1*a++
10*a++
```模拟：

 | 步骤| 术语 | 之前 | 贡献 | 后| 总计 |
 | --- | --- | --- | --- | --- | --- |
 | 1 |`-1*a++`| 1 | -1 | 2 | -1 |
 | 2 |`10*a++`| 2 | 20 | 3 | 19 | 19

 输出：```
19
```简单的从左到右的评估仅给出：```
10 - 2 = 8
```这个例子说明了为什么重新排序是必要的。
