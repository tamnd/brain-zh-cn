---
title: "CF 20A - BerOS 文件系统"
description: "我们得到一个字符串形式的文件系统路径。 在此操作系统中，多个连续“/”字符的处理方式与单个“/”完全相同。 这意味着 ///home//user///docs 和 /home/user/docs 等路径引用相同的位置。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 20
codeforces_index: "A"
codeforces_contest_name: "Codeforces Alpha Round 20 (Codeforces format)"
rating: 1700
weight: 20
solve_time_s: 80
verified: true
draft: false
---
[CF 20A - BerOS 文件系统](https://codeforces.com/problemset/problem/20/A)

 **评分：** 1700
 **标签：** 实施
 **求解时间：** 1m 20s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个字符串形式的文件系统路径。 在该操作系统中，多个连续的`'/'`字符的处理方式与单个字符完全相同`'/'`。 这意味着像这样的路径`///home//user///docs`和`/home/user/docs`指同一位置。 

任务是将路径转换为其规范化形式。 标准化路径仅保留一个`'/'`目录名称之间。 唯一的例外是根目录本身，它必须完全保留`"/"`。 

输入的长度最多为100个字符，非常小。 即使是二次解也能在限制内顺利运行。 线性扫描仍然是最干净的方法，因为问题自然要求我们一个接一个地处理字符并决定是否应保留或丢弃每个斜杠。 

棘手的部分是正确处理尾部斜杠。 像这样的路径：```
/usr/local///
```必须成为：```
/usr/local
```仅压缩连续斜杠的粗心实现会错误地生成：```
/usr/local/
```另一个边缘情况是根目录本身。 例如：```
////
```应标准化为：```
/
```如果我们盲目地删除所有重复的斜杠，然后删除尾部斜杠，我们可能会意外地生成一个空字符串，而不是所需的根路径。 

一种更微妙的情况是斜杠出现在中间：```
/a////b///c
```正确的输出是：```
/a/b/c
```每组连续斜杠必须恰好折叠成一个斜杠，而不是零。 

## 方法

 暴力策略会重复搜索字符串以查找出现的情况`"//"`并将它们替换为`"/"`直到没有双斜杠剩余。 之后，如果生成的路径长度大于一，我们可以删除尾部斜杠。 

这是有效的，因为每次替换都会缩短字符串，并且最终不会保留连续的斜杠。 由于字符串长度只有 100，即使重复替换也足够快。 

缺点是重复的字符串重建原则上效率低下。 假设字符串长度更大，比如说`10^5`。 每次替换都可能需要线性时间，因为字符串是不可变的，并且我们可能会执行多次替换。 在最坏的情况下，类似：```
//////////////////////////////////////////////////
```一次会反复缩小一个字符，导致二次行为。 

更好的观察是我们实际上不需要重新审视早期的角色。 从左到右扫描时，唯一重要的是我们保留的前一个字符是否是`'/'`。 

如果当前字符不是`'/'`，我们始终保留它。 

如果当前字符是`'/'`，只有当先前保留的字符不存在时我们才保留它`'/'`。 

这将问题转化为对字符串的单个线性传递。 

构建压缩路径后，我们仍然需要处理尾部斜杠。 应删除任何尾部斜杠，除非整个路径只是`"/"`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(n) | 已接受 |
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 读取输入路径字符串。 
2. 创建一个空列表来存储规范化字符。 
3. 逐个字符地遍历路径。 
4. 如果当前字符不是`'/'`，将其直接附加到结果中。 

目录名称和字母必须始终保持不变。 
5. 如果当前字符是`'/'`，检查结果中已存储的最后一个字符。 

如果结果为空或者最后存储的字符不是`'/'`，附加斜杠。 

否则跳过它，因为连续的斜杠相当于一个斜杠。 
6. 将收集到的字符转换回字符串。 
7. 当字符串长度大于 1 时，删除尾部斜杠。 

条件`length > 1`保护根目录路径`"/"`免于变得空虚。 
8. 打印最终标准化路径。 

### 为什么它有效

 该算法在扫描期间保持一个简单的不变量：部分构建的结果永远不会包含两个连续的斜杠。 

每当我们遇到斜杠时，仅当之前保留的字符不是斜杠时，我们才会附加它。 这保证了原始字符串中的每个最大斜杠块恰好成为结果中的一个斜杠。 

所有非斜杠字符均按原样按顺序复制，因此目录名称保持不变。 

最后，删除尾部斜杠，同时保留至少一个字符可以保证像这样的路径`"/usr///"`变得`"/usr"`而表示根目录的路径则完全保留`"/"`。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

path = input().strip()

result = []

for ch in path:
    if ch != '/':
        result.append(ch)
    else:
        if not result or result[-1] != '/':
            result.append('/')

ans = ''.join(result)

while len(ans) > 1 and ans[-1] == '/':
    ans = ans[:-1]

print(ans)
```代码的第一部分执行线性扫描。 这`result`list 充当可变字符串构建器，这比重复连接字符串更有效。 

条件：```
if not result or result[-1] != '/':
```是关键的一步。 它决定当前斜杠是开始一个新的分隔符块还是属于一个已经存在的分隔符块。 

使用列表而不是字符串连接可以避免不必要的中间字符串重建。 由于约束如此之小，这不是强制性的，但它是良好的竞争性编程实践。 

决赛`while`循环小心地删除尾部斜杠：```
while len(ans) > 1 and ans[-1] == '/':
```这`len(ans) > 1`情况危急。 如果没有它，输入：```
////
```会错误地变成空字符串而不是`"/"`。 

## 工作示例

 ### 示例 1

 输入：```
//usr///local//nginx/sbin
```| 当前角色 | 之前的结果 | 行动| | 之后的结果
 | --- | --- | --- | --- |
 |`/`|`""`| 保留斜杠 |`/`|
 |`/`|`/`| 跳过斜线|`/`|
 |`u`|`/`| 保持字符|`/u`|
 |`s`|`/u`| 保持字符|`/us`|
 |`r`|`/us`| 保持字符|`/usr`|
 |`/`|`/usr`| 保留斜杠 |`/usr/`|
 |`/`|`/usr/`| 跳过斜线|`/usr/`|
 |`/`|`/usr/`| 跳过斜线|`/usr/`|
 |`l`|`/usr/`| 保持字符|`/usr/l`|

 对于剩余的角色，将继续执行相同的过程。 每个斜线块都会折叠成一个斜线。 

最终输出：```
/usr/local/nginx/sbin
```该跟踪演示了构造结果从不包含连续斜杠的不变性。 

### 示例 2

 输入：```
/////
```| 当前角色 | 之前的结果 | 行动| | 之后的结果
 | --- | --- | --- | --- |
 |`/`|`""`| 保留斜杠 |`/`|
 |`/`|`/`| 跳过斜线|`/`|
 |`/`|`/`| 跳过斜线|`/`|
 |`/`|`/`| 跳过斜线|`/`|
 |`/`|`/`| 跳过斜线|`/`|

 扫描后，中间结果为：```
/
```尾部斜杠清理不执行任何操作，因为字符串长度已经是`1`。 

最终输出：```
/
```此示例验证根目录是否已正确保留。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个字符被处理一次 |
 | 空间| O(n) | 结果列表存储规范化路径 |

 最大输入长度仅为 100 个字符，因此该算法可以轻松满足时间和内存限制。 即使较慢的方法也可以通过，但线性扫描是最干净、最具可扩展性的解决方案。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve():
    import sys
    input = sys.stdin.readline

    path = input().strip()

    result = []

    for ch in path:
        if ch != '/':
            result.append(ch)
        else:
            if not result or result[-1] != '/':
                result.append('/')

    ans = ''.join(result)

    while len(ans) > 1 and ans[-1] == '/':
        ans = ans[:-1]

    print(ans)

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()

    backup_stdout = sys.stdout
    sys.stdout = out

    solve()

    sys.stdout = backup_stdout

    return out.getvalue().strip()

# provided sample
assert run("//usr///local//nginx/sbin\n") == "/usr/local/nginx/sbin", "sample 1"

# minimum-size input
assert run("/\n") == "/", "single root slash"

# multiple slashes representing root
assert run("//////\n") == "/", "root normalization"

# trailing slash removal
assert run("/usr/local///\n") == "/usr/local", "remove trailing slashes"

# consecutive middle slashes
assert run("/a////b///c\n") == "/a/b/c", "compress middle slashes"

# already normalized path
assert run("/home/user/docs\n") == "/home/user/docs", "unchanged normalized path"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`/`|`/`| 最小有效输入 |
 |`//////`|`/`| 根目录保存|
 |`/usr/local///`|`/usr/local`| 尾部斜杠清理 |
 |`/a////b///c`|`/a/b/c`| 内部斜杠块的压缩 |
 |`/home/user/docs`|`/home/user/docs`| 已经标准化的路径保持不变 |

 ## 边缘情况

 考虑输入：```
/usr/local///
```在扫描过程中，算法会压缩最终的`///`到单个尾部斜杠中，产生：```
/usr/local/
```然后，清理循环会删除尾部斜杠，因为字符串长度大于 1。 最终答案变成：```
/ usr/local
```没有空格：```
/usr/local
```这证实了非根路径永远不会以不必要的斜杠结尾。 

现在考虑：```
////
```扫描仅保留第一个斜杠并跳过所有剩余的斜杠。 中间结果是：```
/
```清理循环检查：```
len(ans) > 1
```由于长度等于`1`，没有任何内容被删除。 根目录仍然有效。 

最后，考虑：```
/a////b///c
```扫描独立处理每个斜杠组。 每个最大连续块都变成一条斜杠，给出：```
/ a / b / c
```没有空格：```
/ a/b/c
```最后：```
/a/b/c
```这证实了该算法保留了目录结构，同时消除了冗余分隔符。
