---
title: "CF 106169B - 怀旧"
description: "正在分析的程序是用 Scratch 编写的，由读取值、将它们存储在变量中、计算新值和打印结果的简单命令组成。 在早期测试期间，程序员在每次输入操作之前使用额外的调试输出。"
date: "2026-06-25T11:07:47+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106169
codeforces_index: "B"
codeforces_contest_name: "2025-2026 ICPC NERC, Kyrgyzstan Regional Contest"
rating: 0
weight: 106169
solve_time_s: 37
verified: true
draft: false
---

[CF 106169B - 怀旧](https://codeforces.com/problemset/problem/106169/B)

 **评级：** -
 **标签：** -
 **求解时间：** 37s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 正在分析的程序是用 Scratch 编写的，由读取值、将它们存储在变量中、计算新值和打印结果的简单命令组成。 在早期测试期间，程序员在每次输入操作之前使用额外的调试输出。 这个额外的输出只是即将接收输入的变量的名称，这有助于他们了解程序正在等待什么值。 

任务是计算这些附加调试输出打印了多少个字符。 程序的最终提交版本将不包含这些输出，因此只有连接到输入操作的变量名称才有助于答案。 

输入包含程序行数，后跟命令本身。 在所有可能的命令中，只有存储特殊临时值的行`answer`到变量中表示输入操作。 对于每个这样的行，必须将目标变量名称的长度添加到结果中。 

行数可以达到 100000 条，因此解决方案必须检查每条行恒定的次数。 模拟 Scratch 程序或尝试评估每个变量值的方法会做不必要的工作。 线性扫描就足够了，因为答案仅取决于接收输入的变量的名称。 

一个常见的错误是计算程序中出现的每个变量名。 例如：```
6
Ask read_token and wait
Set first to answer
Set result to first + second
Say result
Ask read_token and wait
Set second to answer
```正确的输出是：```
11
```仅有的`first`和`second`用于输入、贡献`5 + 6 = 11`。 计数`result`会错误地添加仅计算的变量中的字符。 

另一个边缘情况是重复输入同一变量：```
8
Ask read_token and wait
Set a to answer
Ask read_token and wait
Set a to answer
Set b to a + a
Say b
Ask read_token and wait
Set c to answer
```正确的输出是：```
3
```变量`a`贡献两次并且`c`贡献一次，所以总数是`1 + 1 + 1 = 3`。 计算唯一变量名称的粗心实现将返回`2`，这是不正确的。 

## 方法

 最直接的方法是理解Scratch程序中的每个命令，跟踪变量并模拟执行。 这是正确的，因为它遵循原始程序的确切行为。 然而，它解决了一个比必要的更困难的问题。 变量中存储的值、算术运算和打印结果永远不会影响答案。 如果每个操作都被模拟，那么实施将花费时间维护不相关的信息。 

关键的观察结果是额外的输出仅发生在输入之前。 该语句保证每个输入请求都与来自的一个分配恰好配对`answer`，并且每个这样的分配都遵循输入请求。 这意味着表格的每一行`Set name to answer`直接显示测试期间打印的一个变量名称。 

问题被简化为字符串处理。 我们只需要识别那些赋值行并添加后面出现的变量名的长度`Set`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n) 具有不必要的模拟工作 | O(变量数量) | 正确但过于复杂 |
 | 最佳 | O(n) | O(1) 额外空间 | 已接受 |

 ## 算法演练

 1、读取Scratch程序中的行数，并逐条处理命令。 由于每条线路都可以独立检查，因此无需存储整个程序。 
2. 对于每条代表的线`Set name to answer`， 提炼`name`并将其长度添加到答案中。 这是与附加本地测试输出相对应的唯一命令类型。 
3. 忽略所有其他命令，因为它们要么在内部操作值，要么显示最终的程序输出。 它们不会创建额外的调试字符。 
4. 打印累计总数。 

为什么它有效：

 扫描期间保持的不变性是，在处理程序的任何前缀之后，存储的答案等于该前缀内的所有输入操作产生的额外字符的数量。 一条线仅在存储时才起作用`answer`到一个变量中，在这种情况下，本地测试输出将正是该变量名称。 每个这样的行都被计算一次，并且没有其他行可以贡献。 完成扫描后，不变量给出所需的总数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    ans = 0

    for _ in range(n):
        line = input().strip()
        if line.startswith("Set ") and line.endswith(" to answer"):
            name = line[4:line.index(" to answer")]
            ans += len(name)

    print(ans)

if __name__ == "__main__":
    solve()
```该代码只读取每个 Scratch 命令一次。 该条件检查标识输入分配的两个部分：命令必须以`Set`，并且分配的值必须是保留字`answer`。 

变量名位于固定前缀之间`Set `和后缀` to answer`。 使用后缀的位置可以避免依赖于可变长度并正确处理所有有效名称。 

该实现不存储命令或变量，因为不需要前面几行的信息。 整数答案可达`10^9`，Python 处理它时不会出现溢出问题。 

## 工作示例

 ### 示例 1

 输入：```
6
Ask read_token and wait
Set first to answer
Ask read_token and wait
Set second to answer
Set result to first + second
Say result
```| 步骤| 命令 | 识别的输入变量 | 当前答案 |
 | ---| ---| ---| ---|
 | 1 | 询问 read_token 并等待 | 无 | 0 |
 | 2 | 设置第一个回答| 第一 | 5 |
 | 3 | 询问 read_token 并等待 | 无 | 5 |
 | 4 | 设置第二个答案 | 第二 | 11 | 11
 | 5 | 将结果设置为第一个 + 第二个 | 无 | 11 | 11
 | 6 | 说出结果 | 无 | 11 | 11

 跟踪显示只有接收用户输入的变量才重要。 计算变量，例如`result`被忽略。 

### 示例 2

 输入：```
15
Ask read_token and wait
Set a to answer
Ask read_token and wait
Set bb to answer
Set ccc to a * bb
Set dddd to a / bb
Set dddd to ccc + dddd
Say dddd
Ask read_token and wait
Set bb to answer
Ask read_token and wait
Set ccc to answer
Set x to bb * dddd
Set x to ccc - x
Say x
```| 步骤| 命令 | 识别的输入变量 | 当前答案 |
 | ---| ---| ---| ---|
 | 1 | 询问 read_token 并等待 | 无 | 0 |
 | 2 | 设置一个来回答 | 一个 | 1 |
 | 3 | 询问 read_token 并等待 | 无 | 1 |
 | 4 | 设置 bb 接听 | BB | 3 |
 | 5 | 将 ccc 设置为 * bb | 无 | 3 |
 | 6 | 将 dddd 设置为 a / bb | 无 | 3 |
 | 7 | 将 dddd 设置为 ccc + dddd | 无 | 3 |
 | 8 | 说 dddd | 无 | 3 |
 | 9 | 询问 read_token 并等待 | 无 | 3 |
 | 10 | 10 设置 bb 接听 | BB | 5 |
 | 11 | 11 询问 read_token 并等待 | 无 | 5 |
 | 12 | 12 设置抄送接听 | ccc | 8 |
 | 13 | 将 x 设置为 bb * dddd | 无 | 8 |
 | 14 | 14 将 x 设置为 ccc - x | 无 | 8 |
 | 15 | 15 说 x | 无 | 8 |

 此示例演示了每次接收输入时都会对重复变量进行计数。 变量名称本身不是被计数的单位，输入事件才是。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 每个程序行都会检查一次。 |
 | 空间| O(1) | O(1) | 仅存储当前行和累积答案。 |

 这些约束最多允许 100000 条线，因此线性扫描很容易满足所需的限制。 该解决方案仅执行字符串检查和长度添加，没有昂贵的数据结构。 

## 测试用例```python
import sys
import io

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

# provided sample 1
assert run("""6
Ask read_token and wait
Set first to answer
Ask read_token and wait
Set second to answer
Set result to first + second
Say result
""") == "11\n", "sample 1"

# provided sample 2
assert run("""15
Ask read_token and wait
Set a to answer
Ask read_token and wait
Set bb to answer
Set ccc to a * bb
Set dddd to a / bb
Set dddd to ccc + dddd
Say dddd
Ask read_token and wait
Set bb to answer
Ask read_token and wait
Set ccc to answer
Set x to bb * dddd
Set x to ccc - x
Say x
""") == "8\n", "sample 2"

# minimum number of lines
assert run("""2
Ask read_token and wait
Set x to answer
""") == "1\n", "single character variable"

# repeated input to the same variable
assert run("""6
Ask read_token and wait
Set abc to answer
Ask read_token and wait
Set abc to answer
Say abc
Say abc
""") == "6\n", "repeated inputs"

# many non-input commands
assert run("""5
Set a to answer
Set b to a + a
Set c to b * b
Say c
Say a
""") == "1\n", "only answer assignments count"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单次输入`x`| 1 | 最小可变长度处理 |
 | 两个输入`abc`| 6 | 重复出现的单独计数 |
 | 仅在一次输入后进行算术编程 | 1 | 非输入分配被忽略 |
 | 提供样品| 11 和 8 | 匹配官方示例 |

 ## 边缘情况

 一个程序可能包含许多变量名，但只有输入变量起作用。 对于输入：```
6
Ask read_token and wait
Set first to answer
Set result to first + first
Say result
Ask read_token and wait
Set second to answer
```该算法仅识别`first`和`second`，生产`5 + 6 = 11`。 算术直线涉及`result`被跳过，因为它不包含`answer`。 

重复输入需要对每次出现的情况进行计数。 为了：```
8
Ask read_token and wait
Set a to answer
Ask read_token and wait
Set a to answer
Set b to a + a
Say b
Ask read_token and wait
Set c to answer
```扫描添加`1`对于每次出现`a`和`1`为了`c`, 给予`3`。 该算法自然地处理这个问题，因为它处理命令而不是维护一组变量名称。 

碰巧提到变量但不是输入赋值的命令将被忽略。 一行例如`Set value to other + value`更改程序状态，但在此之前没有产生额外的调试输出，因此它一定不会影响答案。
